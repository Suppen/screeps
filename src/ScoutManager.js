"use strict";

const WorkforceManager = require("WorkforceManager");

/**
 * Manages scouts, which go to neighbour rooms and give visibility of them
 */
class ScoutManager extends WorkforceManager {
	/**
	 * Creates a new scout manager
	 *
	 * @param {RoomManager} roomManager	The room manager which owns this workforce manager. Must have a spawn manager on it!
	 */
	constructor(roomManager) {
		super(roomManager.spawnManager);

		/**
		 * The room manager for this energy manager
		 */
		this.roomManager = roomManager;
	}

	/**
	 * Amount of scouts to maintain
	 *
	 * @private
	 */
	get _scoutAmount() {
		return this.exits.amount;
	}

	/**
	 * The memory object for this manager
	 */
	get memory() {
		if (this.roomManager.memory.scoutManager === undefined) {
			this.roomManager.memory.scoutManager = {};
		}
		return this.roomManager.memory.scoutManager;
	}

	/**
	 * Name of the workforce
	 */
	get workforceName() {
		return this.roomManager.roomName + ".scoutManager";
	}

	/**
	 * Map of creeps wanted for this manager, with role names as the key
	 */
	get wantedCreeps() {
		return {};
	}

	/** Never scouted */
	static get UNKNOWN() {return "unknown";}

	/** Source keepers present */
	static get SOURCE_KEEPERS() {return "sourcekeepers";}

	/** Owned by someone else */
	static get OWNED_BY_HOSTILE() {return "owned by hostile";}

	/** Reserved by someone else */
	static get RESERVED_BY_HOSTILE() {return "reserved by hostile";}

	/** Claimable, but not owned by anybody */
	static get CLAIMABLE() {return "claimable";}

	/** Nothing of interest. The sector dividers */ // The center room of sectors have three sources and no controller, but are not reachable with this setup
	static get UNINTERESTING() {return "uninteresting";}

	/** Reserved by me */
	static get RESERVED_BY_ME() {return "reserved by me";}

	/** Owned by me */
	static get OWNED_BY_ME() {return "owned by me";}

	/** Dangerous. A hostile creep was there recently */
	static get DANGEROUS() {return "dangerous";}

	/** Array of all statuses */
	static get ALL_STATUSES() {
		return [
			ScoutManager.UNKNOWN,
			ScoutManager.SOURCE_KEEPERS,
			ScoutManager.OWNED_BY_HOSTILE,
			ScoutManager.RESERVED_BY_HOSTILE,
			ScoutManager.CLAIMABLE,
			ScoutManager.UNINTERESTING,
			ScoutManager.RESERVED_BY_ME,
			ScoutManager.OWNED_BY_ME,
			ScoutManager.DANGEROUS
		];
	}

	/**
	 * Which sides of the room has exits
	 */
	get exits() {
		let room = this.roomManager.room;
		if (this.memory.exits === undefined) {
			this.memory.exits = {TOP: false, RIGHT: false, BOTTOM: false, LEFT: false};

			// Check for exits
			for (let i = 0; i < 50; i++) {
				if (room.lookForAt(LOOK_TERRAIN, i, 0)[0] !== "wall") {
					this.memory.exits.TOP = true;
				}
				if (room.lookForAt(LOOK_TERRAIN, 0, i)[0] !== "wall") {
					this.memory.exits.LEFT = true;
				}
				if (room.lookForAt(LOOK_TERRAIN, i, 49)[0] !== "wall") {
					this.memory.exits.BOTTOM = true;
				}
				if (room.lookForAt(LOOK_TERRAIN, 49, i)[0] !== "wall") {
					this.memory.exits.RIGHT = true;
				}
			}
		}
		return this.memory.exits;
	}

	/**
	 * The room's observer
	 */
	get observer() {
		// Is it cached?
		if (this._observer === undefined) {
			let structures = this.roomManager.room.find(FIND_MY_STRUCTURES, {
				filter(s) {
					return s instanceof StructureObserver;
				}
			});
			if (structures.length === 1) {
				this._observer = structures[0];
			}
		}
		return this._observer;
	}

	/**
	 * Statuses of rooms
	 */
	get roomStatuses() {
		if (this.memory.roomStatuses === undefined) {
			// Create the object
			this.memory.roomStatuses = {};

			// Parse the room name
			let parsedRoomName = this.roomManager.room.name.match(/^(E|W)(\d+)(N|S)(\d+)$/);
			let ew = parsedRoomName[1];
			let ewA = Number.parseInt(parsedRoomName[2]);
			let ns = parsedRoomName[3];
			let nsA = Number.parseInt(parsedRoomName[4]);

			// Default status object
			const defaultStatus = {
				status: ScoutManager.UNKNOWN,
				lastScouted: 0,
				scoutAssigned: null
			};

			if (this.exits.TOP) {
				let roomName = ew + "" + ewA + "" + ns + "" +  (ns === "N" ? nsA+1 : nsA-1);
				this.memory.roomStatuses[roomName] = _.clone(defaultStatus);
			}
			if (this.exits.BOTTOM) {
				let roomName = ew + "" + ewA + "" + ns + "" +  (ns === "S" ? nsA+1 : nsA-1);
				this.memory.roomStatuses[roomName] = _.clone(defaultStatus);
			}
			if (this.exits.RIGHT) {
				let roomName = ew + "" + (ew === "E" ? ewA+1 : ewA-1) + "" + ns + "" +  nsA;
				this.memory.roomStatuses[roomName] = _.clone(defaultStatus);
			}
			if (this.exits.LEFT) {
				let roomName = ew + "" + (ew === "W" ? ewA+1 : ewA-1) + "" + ns + "" +  nsA;
				this.memory.roomStatuses[roomName] = _.clone(defaultStatus);
			}
		}
		return this.memory.roomStatuses;
	}

	/**
	 * Updates the status of a room
	 *
	 * @param {String} roomName	Name of the room
	 */
	updateRoomStatus(roomName) {
		// Get the room
		let room = Game.rooms[roomName];

		// If the room has visibility, update its status
		if (room !== undefined) {
			// Default room status is unknown
			let status = ScoutManager.UNKNOWN;

			// Check the controller
			let controller = room.controller;
			if (controller === undefined) {
				// Unclaimable, and probably nothing of interest
				status = ScoutManager.UNINTERESTING;

				// Are there keeper lairs in the room?
				if (room.find(FIND_STRUCTURES).filter(s => s instanceof StructureKeeperLair).length > 0) {
					status = ScoutManager.SOURCE_KEEPERS;
				}
			} else if (controller.my) {
				// It's my room :D
				status = ScoutManager.OWNED_BY_ME;
			} else if (controller.reservation) {
				// The room is reserved by someone
				if (controller.reservation.username === this.roomManager.room.controller.owner.username) {
					// The room is reserved by me :D
					status = ScoutManager.RESERVED_BY_ME;
				} else {
					// The room is reserved by someone else
					status = ScoutManager.RESERVED_BY_HOSTILE;
				}
			} else if (controller.owner !== undefined) {
				// Owned by someone else
				status = ScoutManager.OWNED_BY_HOSTILE;
			} else {
				// Claimable
				status = ScoutManager.CLAIMABLE;
			}

			// Mark the room as dangerous if there are hostile creeps there
			if (status === ScoutManager.CLAIMABLE || status === ScoutManager.RESERVED_BY_ME) {
				let hostileCreeps = this.roomManager.armyManager.getHostileCreepsIn(roomName);
				if (hostileCreeps.length > 0) {
					status = ScoutManager.DANGEROUS;
				}
			}

			// Store it to memory
			this.roomStatuses[roomName].status = status;
			this.roomStatuses[roomName].lastScouted = Game.time;
		}
	}

	run() {
		/** Next 3 statements copied from WorkforceManager **/
		// Look for creeps to put in the workforce
		this._findAndAddUnmanagedCreeps();

		// Give managers to creeps
		this._makeCreepManagers();

		// Activate creeps
		this.creepManagers.forEach(m => m.run());

		// Check if the room is strong enough to scout neighbour rooms
		if (this.roomManager.room.controller.level >= 4) {
			// Update room status
			if (Game.time % ScoutManager.statusUpdateInterval === 0 && this.roomManager.room.controller.level >= 4) {
				for (let roomName in this.roomStatuses) {
					this.updateRoomStatus(roomName);

					// Check if there is a scout assigned to the room
					if (Game.creeps[this.roomStatuses[roomName].scoutAssigned] === undefined) {
						Game.creeps[this.roomStatuses[roomName].scoutAssigned] = null;
						// Nope. Check if there is one in the spawn queue
						let spawning = this.spawnManager.spawnQueue.queue.reduce((result, c) => {
							return result || (c.initialMemory.role === "scout" && c.initialMemory.nameOfRoomToScout === roomName)
						}, false);
						if (!spawning) {
							// Need to spawn a scout for this room
							this.spawnManager.addToSpawnQueue({
								body: [MOVE],
								initialMemory: {
									role: "scout",
									nameOfRoomToScout: roomName,
									workforce: this.workforceName
								}
							});
						}
					}
				}
			}
		}
	}

	/**
	 * Interval between status updates
	 */
	static get statusUpdateInterval() {
		return 17;	// Prime
	}
}

module.exports = ScoutManager;
