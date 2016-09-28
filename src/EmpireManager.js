"use strict";

const Manager = require("Manager");

const RoomManager = require("RoomManager");
const ExperimentalRoomManager = require("ExperimentalRoomManager");
const TerminalNetworkManager = require("TerminalNetworkManager");

const config = require("config");

// The singleton instance of the empire manager
let manager = null;

/**
 * Master of all empire logic
 */
class EmpireManager extends Manager {
	/**
	 * Sets up the empire manager
	 */
	constructor() {
		super();

		// Make this the manager instance
		manager = this;

		// Create room managers
		this._createRoomManagers();

		// Create a terminal network manager
		if (config.terminalNetworkManager === undefined) {
			config.terminalNetworkManager = {};
		}
		this.terminalNetworkManager = new TerminalNetworkManager(config.terminalNetworkManager);
	}

	/**
	 * The global memory object
	 */
	get memory() {
		return Memory;
	}

	/**
	 * The global config
	 */
	get config() {
		return config;
	}

	/**
	 * List of unmanaged creeps waiting to be assigned to workforces
	 *
	 * @private
	 */
	get _unmanagedCreeps() {
		if (this.memory.unmanagedCreeps === undefined) {
			this.memory.unmanagedCreeps = {};
		}
		return this.memory.unmanagedCreeps;
	}

	/**
	 * Map of newly spawned creeps which have not been picked up by their workforce manager yet
	 *
	 * @private
	 */
	get _newlySpawnedCreeps() {
		if (this.memory.newlySpawnedCreeps === undefined) {
			this.memory.newlySpawnedCreeps = {};
		}
		return this.memory.newlySpawnedCreeps;
	}

	/**
	 * Adds a newly spawned creep to the map of newly spawned creeps
	 */
	addNewlySpawnedCreep(uid, name) {
		this._newlySpawnedCreeps[uid] = name;
	}

	/**
	 * Marks a creep as failed to spawn
	 */
	failedToSpawnCreep(uid) {
		this._newlySpawnedCreeps[uid] = null;
	}

	/**
	 * Takes the name of a newly spawned creep
	 *
	 * @return {String}	Name of the newly spawned creep, or null if it has not spawned yet
	 */
	takeCreep(uid) {
		let name = this._newlySpawnedCreeps[uid];
		if (name !== undefined) {
			delete this._newlySpawnedCreeps[uid];
		} else {
			name = null;
		}
		return name;
	}

	/**
	 * Adds an unmanaged creep to the list of unmanaged creeps
	 *
	 * @param {String} creepName	Name of the unmanaged creep
	 * @param {String} workforceName	Name of the workforce the creep should belong to
	 */
	addUnmanagedCreep(creepName, workforceName) {
		if (this._unmanagedCreeps[workforceName] === undefined) {
			this._unmanagedCreeps[workforceName] = [];
		}
		this._unmanagedCreeps[workforceName].push(creepName);
	}

	/**
	 * Gets a list of all unmanaged creeps for a workforce. The list will be deleted after it is fetched!
	 *
	 * @param {String} workforceName	Name of the workforce to get unmanaged creeps for
	 *
	 * @return {String[]}	An array with the names of all unmanaged creeps belonging to the workforce
	 */
	getUnmanagedCreepsFor(workforceName) {
		// The list
		let unmanagedCreeps = [];

		// Check if an array exists for this workforce
		if (this._unmanagedCreeps[workforceName] !== undefined) {
			unmanagedCreeps = this._unmanagedCreeps[workforceName];
		}

		// Reset the array
		this._unmanagedCreeps[workforceName] = [];

		// Return the list
		return unmanagedCreeps;
	}

	/**
	 * Cleans up unused memory
	 */
	cleanMemory() {
		// Clean up dead creeps
		let allCreepNames = Object.keys(Game.creeps);
		for (let mCreep in Memory.creeps) {
			if (allCreepNames.indexOf(mCreep) < 0) {
				delete Memory.creeps[mCreep];
			}
		}

		// Clean up lost rooms
		let allRooms = Object.keys(Game.rooms);
		for (let mRoom in Memory.rooms) {
			if (allRooms.indexOf(mRoom) < 0) {
				delete Memory.rooms[mRoom];
			}
		}
	}

	/**
	 * Creates room managers for all owned rooms
	 *
	 * @private
	 */
	_createRoomManagers() {
		/**
		 * The room managers in the empire
		 */
		this.roomManagers = {};

		// Loop through all known rooms
		for (let roomName in Game.rooms) {
			// Only make managers for owned rooms
			if (Game.rooms[roomName].controller !== undefined && Game.rooms[roomName].controller.my) {
				// Get the room config
				let roomConfig = this.config.roomConfigs[roomName];
				if (roomConfig === undefined) {
					console.log("No config for " + roomName);
					roomConfig = {};
				}

				// Make the manager
				this.roomManagers[roomName] = new RoomManager(roomName, roomConfig);
			}
		}
	}

	run() {
		// Clean up memory every now and then
		if (Game.time % EmpireManager.cleanupInterval === 0) {
			this.cleanMemory();
		}

		// Run the room managers
		for (let r in this.roomManagers) {
			this.roomManagers[r].run();
		}

		// Run the terminal network manager
		this.terminalNetworkManager.run();
	}

	/**
	 * The singleton instance
	 */
	static get manager() {
		if (manager === null) {
			manager = new EmpireManager();
		}
		return manager;
	}

	/**
	 * Interval between each memory cleanup of dead creeps
	 */
	static get cleanupInterval() {
		return 47;	// Prime
	}
}

module.exports = EmpireManager;
