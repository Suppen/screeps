"use strict";

const Manager = require("Manager");
const SpawnManager = require("SpawnManager");

// Make a map between creep managers and roles
const roleManagerMap = {
	energyHarvester: require("EnergyHarvesterCreepManager"),
	remoteEnergyHarvester: require("RemoteEnergyHarvesterCreepManager"),
	energyCollector: require("EnergyCollectorCreepManager"),
	remoteEnergyCollector: require("RemoteEnergyCollectorCreepManager"),
	builder: require("BuilderCreepManager"),
	repairer: require("RepairerCreepManager"),
	upgrader: require("UpgraderCreepManager"),
	attacker: require("AttackerCreepManager"),
	remoteBuilder: require("RemoteBuilderCreepManager"),
	claimer: require("ClaimerCreepManager"),
	healer: require("HealerCreepManager"),
	scout: require("ScoutCreepManager"),
	constructionSiteDestroyer: require("ConstructionSiteDestroyerCreepManager"),
	reserver: require("ReserverCreepManager"),
	mineralHarvester: require("MineralHarvesterCreepManager"),
	defender: require("DefenderCreepManager")
};

/**
 * Handles creation and replacement of worker creeps
 */
class WorkforceManager extends Manager {
	/**
	 * Constructs a new workforce manager
	 *
	 * @param {RoomManager} roomManager	Room manager for this workforce manager
	 * @param {SpawnManager} roomManager.spawnManager	The spawn manager which will spawn this workforce
	 */
	constructor(roomManager) {
		super();

		/**
		 * The workforce's room manager
		 */
		this.roomManager = roomManager;

		if (!(this.roomManager.spawnManager instanceof SpawnManager)) {
			throw new Error("No spawn manager on room manager given to " + this.workforceName);
		}

		/**
		 * The spawn manager which spawns this workforce
		 */
		this.spawnManager = spawnManager
	}

	/**
	 * The name of this workforce
	 *
	 * @return {String}	Name of the workforce
	 */
	get workforceName() {
		throw new Error("No name defined for workforce manager");
	}

	/**
	 * The memory object for this manager
	 *
	 * @return {Object}	Memory for this workforce manager
	 */
	get memory() {
		if (this.roomManager.memory.workforceManager === undefined) {
			this.roomManager.memory.workforceManager = {};
		}
		return this.roomManager.memory.workforceManager;
	}

	/**
	 * All creep managers for creeps managed by this workforce manager
	 *
	 * @return {CreepManager[]}	An array of all creep managers managed by this workforce manager
	 */
	get workforce() {
		// Check if the memory location exists
		if (this.memory.workforce === undefined) {
			this.memory.workforce = [];
		}

		// Check if the workforce is cached
		if (this._workforce === undefined) {
			// Nope... Make it and cache it
			this._workforce = this.memory.workforce.map(name => {
				// Get the creep
				let creep = Game.creeps[name];

				// Check if the creep exists
				if (creep === undefined) {
					// The creep no longer exists. Remove it from the workforce
					this._removeCreepFromWorkforce(name);
				}
				return creep;
			})
			.filter(creep => creep !== undefined)	// Remove dead creeps
			.map(creep => new this._determineCreepManager(creep));	// Make managers for the creeps
		}

		return this._workforce;
	}

	/**
	 * Determines the creep manager for a creep
	 *
	 * @param {Creep} creep	The creep to determine the manager for
	 *
	 * @private
	 */
	_determineCreepManager(creep) {
		// Look up the manager in the map
		let manager = roleManagerMap[creep.memory.role];

		// Does the manager exist?
		if (manager === undefined) {
			// Nope. Make a dummy manager
			manager = function() {
				this.run = function() {
					console.log("Could not find manager for role " + creep.memory.role);
				};
			};
		}
		return manager;
	}

	/**
	 * Adds a creep to the workforce
	 *
	 * @param {String} name	The name of the creep to add
	 */
	addCreepToWorkforce(name) {
		// Add to the workforce memory array
		this.memory.workforce.push(name);
	}

	/**
	 * Removes a creep from the workforce
	 *
	 * @param {String} creep	The name of the creep
	 */
	removeCreepFromWorkforce(name) {
		let i = this.memory.workforce.indexOf(name);
		if (i >= 0) {
			this.memory.workforce.splice(i, 1);
		}
	}
}

module.exports = WorkforceManager;
