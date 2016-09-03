
"use strict";

const Manager = require("Manager");

const RoadManager = require("RoadManager");
const SpawnManager = require("SpawnManager");
const EnergyManager = require("EnergyManager");
const ConstructionManager = require("ConstructionManager");
const TowerManager = require("TowerManager");
const RepairManager = require("RepairManager");
const MiscWorkforceManager = require("MiscWorkforceManager");
const ScoutManager = require("ScoutManager");
const ArmyManager = require("ArmyManager");

const defaultConfig = {
	energyManager: {},
	repairManager: {},
	constructionManager: {},
	miscWorkforceManager: {},
	armyManager: {}
};

/**
 * Handles everything happening in a room and adjacent rooms not controlled by me
 */
class RoomManager extends Manager {
	/**
	 * Creates a new room manager for a room
	 *
	 * @param {String} roomName	Name of the room to manage
	 * @param {Object} roomConfig	Configuration for the room
	 */
	constructor(roomName, roomConfig) {
		super();

		/**
		 * The room's name
		 */
		this.roomName = roomName;

		/**
		 * The room's config
		 */
		this.config = _.defaults(roomConfig, defaultConfig);

		// Create submanagers
		this._createSubmanagers();
	}

	/**
	 * The memory object for this room
	 */
	get memory() {
		if (this.empireManager.memory.rooms[this.roomName] === undefined) {
			this.empireManager.memory.rooms[this.roomName] = {};
		}
		return this.empireManager.memory.rooms[this.roomName];
	}

	/**
	 * Gets the room object for the main room of this manager
	 */
	get room() {
		return Game.rooms[this.roomName];
	}

	/**
	 * Runs 'find()' on all rooms managed by this room manager
	 *
	 * @param {String} type	One of the FIND_* constants
	 * @param {Object} [opts]	An object with additional parameters
	 * @param {Function} [opts.filter]	Function to filter the results
	 * @param {String[]} [opts.roomStatuses]	List of statuses of rooms to search. If not given, all statuses will be searched
	 */
	find(type, opts = {}) {
		let result = this.room.find(type, opts);

		// Don't filter on room status by default
		if (opts.roomStatuses === undefined) {
			opts.roomStatuses = ScoutManager.ALL_STATUSES;
		}

		// Iterate over neighbour rooms
		for (let roomName in this.scoutManager.roomStatuses) {
			let status = this.scoutManager.roomStatuses[roomName];
			if (opts.roomStatuses.indexOf(status.status) >= 0) {
				let room = Game.rooms[roomName];
				if (room !== undefined) {
					result = result.concat(room.find(type, opts));
				}
			}
		}

		return result;
	}

	/**
	 * Checks if a room controller has not been upgraded in the last 1000 ticks, and notifies if it hasn't
	 */
	checkController() {
		let downgradeTime = CONTROLLER_DOWNGRADE[this.room.controller.level];
		if (downgradeTime - this.room.controller.ticksToDowngrade === 1000) {
			Game.notify("Controller in room " + this.roomName + " has not been upgraded for 1000 ticks!");
		}
	}

	/**
	 * Creates all the rooms sub managers
	 *
	 * @private
	 */
	_createSubmanagers() {
		this.roadManager = new RoadManager(this);
		this.spawnManager = new SpawnManager(this);
		this.energyManager = new EnergyManager(this, this.config.energyManager);
		this.repairManager = new RepairManager(this, this.config.repairManager);
		this.constructionManager = new ConstructionManager(this, this.config.constructionManager);
		this.miscWorkforceManager = new MiscWorkforceManager(this, this.config.miscWorkforceManager);
		this.towerManager = new TowerManager(this);
		this.scoutManager = new ScoutManager(this);
		this.armyManager = new ArmyManager(this, this.config.armyManager);
	}

	/**
	 * Runs all the room manager's sub managers
	 *
	 * @private
	 */
	_runSubmanagers() {
		this.roadManager.run();
		this.energyManager.run();
		this.constructionManager.run();
		this.towerManager.run();
		this.repairManager.run();
		this.miscWorkforceManager.run();
		this.scoutManager.run();
		this.armyManager.run();
		this.spawnManager.run();
	}

	run() {
		// Run the sub managers
		this._runSubmanagers();

		// Check the controller
		this.checkController();
	}
}

module.exports = RoomManager;
