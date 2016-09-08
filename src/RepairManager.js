"use strict";

const WorkforceManager = require("WorkforceManager");
const ScoutManager = require("ScoutManager");

const PriorityQueue = require("PriorityQueue");

const defaultConfig = {
	wantedCreeps: {},
	useStoredEnergy: false,
	acceptableStatuses: [
		ScoutManager.CLAIMABLE,
		ScoutManager.RESERVED_BY_ME,
		ScoutManager.UNINTERESTING
	]
};

/**
 * Handles all repairing for a room manager
 */
class RepairManager extends WorkforceManager {
	/**
	 * Create a new repair manager
	 *
	 * @param {RoomManager} roomManager	The room manager this repair manager manages repairs for
	 * @param {Object} config	Configuration for the repair manager
	 */
	constructor(roomManager, config) {
		super(roomManager.spawnManager);

		/**
		 * The room manager this repair manager manages repairs for
		 */
		this.roomManager = roomManager;

		/**
		 * The config for this construction manager
		 */
		this.config = _.defaults(config, defaultConfig);
	}

	/**
	 * The name of this workforce
	 */
	get workforceName() {
		return this.roomManager.roomName + ".repairManager";
	}

	/**
	 * Map of creeps wanted for this manager, with role names as the key
	 */
	get wantedCreeps() {
		return this.config.wantedCreeps;
	}

	/**
	 * The memory object for this repair manager
	 */
	get memory() {
		if (this.roomManager.memory.repairManager === undefined) {
			this.roomManager.memory.repairManager = {};
		}
		return this.roomManager.memory.repairManager;
	}

	/**
	 * Whether or not energy in the storage can be used
	 */
	get useStoredEnergy() {
		return this.config.useStoredEnergy;
	}

	/**
	 * The repair queue of the manager
	 */
	get repairQueue() {
		if (this._repairQueue === undefined) {
			if (this.memory.repairQueue === undefined) {
				this.memory.repairQueue = [];
			}
			this._repairQueue = new PriorityQueue(this.memory.repairQueue);
		}
		return this._repairQueue;
	}

	/**
	 * Queue of structures which should be repaired if nothing else is scheduled
	 */
	get unscheduledRepairQueue() {
		if (this.memory.unscheduledRepairQueue === undefined) {
			this.memory.unscheduledRepairQueue = [];
		}
		if (this.memory.unscheduledRepairQueue.length === 0) {
			// Add damaged, unscheduled stuff
			this.memory.unscheduledRepairQueue = this.roomManager.find(FIND_STRUCTURES, {
				roomStatuses: this.config.acceptableStatuses,
				filter(s) {
					return s.hits < s.hitsMax;
				}
			})
			.sort((a, b) => {
				if (a instanceof StructureRoad) {
					return 1;
				} else if (b instanceof StructureRoad) {
					return -1;
				}

				// Count ramparts as walls when it comes to max hits
				let hitsMaxA = a instanceof StructureRampart ? WALL_HITS_MAX : a.hitsMax;
				let hitsMaxB = b instanceof StructureRampart ? WALL_HITS_MAX : b.hitsMax;

				return (a.hits/hitsMaxA) - (b.hits/hitsMaxB);
			})
			.slice(0, 10)
			.map(s => s.id);
		}
		return this.memory.unscheduledRepairQueue;
	}

	/**
	 * Adds a structure to the repair queue. Will not add if the structure is already there
	 *
	 * @param {Structure} structure	The structure to add
	 */
	addToRepairQueue(structure) {
		let id = structure.id;
		if (this.repairQueue.queue.indexOf(id) < 0) {
			this.repairQueue.add(id);
		}
	}

	/**
	 * Gets the ID of an object to repair
	 *
	 * @return {String|undefined} id	ID of an object to repair, or undefined if everything is in top shape
	 */
	getRepairTargetId() {
		let id = null;
		if (this.repairQueue.size !== 0) {
			// Take the first element from the queue if there is one
			id = this.repairQueue.shift();
		} else {
			// Take the first element from the unscheduled queue
			id = this.unscheduledRepairQueue.shift();
		}

		// Check if the target is in an ok room
		let target = Game.getObjectById(id);
		if (target !== null && target.pos.roomName !== this.roomManager.roomName) {
			let roomStatus = this.roomManager.scoutManager.roomStatuses[target.pos.roomName];
			if (this.config.acceptableStatuses.indexOf(roomStatus) < 0) {
				// Reject this repair and get the next one
				id = this.getRepairTargetId();
			}
		}

		return id;
	}
}

module.exports = RepairManager;
