"use strict";

const WorkforceManager = require("WorkforceManager");
const ScoutManager = require("ScoutManager");
const ReserverCreepManager = require("ReserverCreepManager");

/**
 * Handles reserving of rooms
 */
class ReserverManager extends WorkforceManager {
	/**
	 * Creates a new reserver workforce manager
	 *
	 * @param {RoomManager} roomManager	The room manager which owns this workforce manager. Must have a spawn manager on it!
	 * @param {Object} config	Configuration for the reserver workforce manager
	 */
	constructor(roomManager, config) {
		super(roomManager.spawnManager);

		/**
		 * The room manager for this reserver manager
		 */
		this.roomManager = roomManager;

		/**
		 * The config for this misc workforce manager
		 */
		this.config = _.defaults(config, {
			wantedCreeps: {},
			acceptableStatuses: [
				ScoutManager.CLAIMABLE,
				ScoutManager.RESERVED_BY_ME
			]
		});
	}

	/**
	 * The memory object for this manager
	 */
	get memory() {
		if (this.roomManager.memory.reserverManager === undefined) {
			this.roomManager.memory.reserverManager = {};
		}
		return this.roomManager.memory.reserverManager;
	}

	/**
	 * Name of the workforce
	 */
	get workforceName() {
		return this.roomManager.roomName + ".reserverWorkforce";
	}

	/**
	 * Map of creeps wanted for this manager, with role names as the key
	 */
	get wantedCreeps() {
		if (this._wantedCreeps === undefined) {
			this._wantedCreeps = this.config.wantedCreeps;

			// Always have a reserver for each remotely harvested rooms, if not otherwise specified in config
			const defaultReserver = {
				amount: this._findRemotelyHarvestedRooms().length,
				body: ReserverCreepManager.calculateBody(this.roomManager.room.energyCapacityAvailable)
			};
			if (this._wantedCreeps.reserver === undefined) {
				this._wantedCreeps.reserver = {};
			}
			this._wantedCreeps.reserver = _.defaults(this._wantedCreeps.reserver, defaultReserver);
		}
		return this._wantedCreeps;
	}

	/**
	 * Map between rooms and reservers
	 */
	get _roomsReserversMap() {
		if (this.memory.roomReserverMap === undefined) {
			this.memory.roomReserverMap = {};
		}
		return this.memory.roomReserverMap;
	}

	/**
	 * Finds all rooms which are harvested
	 *
	 * @private
	 */
	_findRemotelyHarvestedRooms() {
		if (this._remotelyHarvestedRooms === undefined) {
			this._remotelyHarvestedRooms = this.roomManager.energyManager.remoteSources
				.map(s => s.pos.roomName)	// Extract the room name of these sources
				.filter((name, pos, self) => self.indexOf(name) === pos);	// Remove duplicates
		}
		return this._remotelyHarvestedRooms;
	}

	/**
	 * Assigns reservers to rooms
	 *
	 * @private
	 */
	_assignReserversToRooms() {
		// Remove mappings where the creep is no longer part of the workforce
		for (let roomName in this._roomsReserversMap) {
			let creep = Game.creeps[this._roomsReserversMap[roomName]];
			if (creep === undefined) {
				delete this._roomsReserversMap[roomName];
			}
		}

		// Find all reservers which do not have an assigned room
		let unassignedReservers = this.creepManagers.filter(cm => cm instanceof ReserverCreepManager && cm.roomToReserve === null);

		// Find all rooms without assigned reservers
		let roomsWithoutReservers = this._findRemotelyHarvestedRooms().filter(roomName => {
			return (
				this._roomsReserversMap[roomName] === undefined &&
				this.config.acceptableStatuses.indexOf(this.roomManager.scoutManager.roomStatuses[roomName].status) >= 0
			);
		});

		// Assign harvesters to sources
		while (unassignedReservers.length > 0 && roomsWithoutReservers.length > 0) {
			let roomName = roomsWithoutReservers.pop();
			let reserver = unassignedReservers.pop();

			this._roomsReserversMap[roomName] = reserver.creepName;
			reserver.roomToReserve = roomName;
		}
	}

	run() {
		// Check if the room is strong enough to reserve neighbour rooms
		if (this.roomManager.room.energyCapacityAvailable >= 1300) {
			super.run();

			this._assignReserversToRooms();
		}
	}
}

module.exports = ReserverManager;
