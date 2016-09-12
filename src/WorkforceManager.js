"use strict";

const Manager = require("Manager");

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
	mineralHarvester: require("MineralHarvesterCreepManager")
};

/**
 * Handles creation and replacement of worker creeps
 */
class WorkforceManager extends Manager {
	/**
	 * Constructs a new workforce manager
	 *
	 * @param {SpawnManager} spawnManager	The spawn manager which will spawn this workforce
	 */
	constructor(spawnManager) {
		super();

		/**
		 * The spawn manager which spawns this workforce
		 */
		this.spawnManager = spawnManager

		/**
		 * List of all creep managers in this workforce
	 	 */
		this.creepManagers = [];
	}

	/**
	 * The name of this workforce
	 */
	get workforceName() {
		throw new Error("No name defined for workforce manager");
	}

	/**
	 * Map of creeps wanted for this manager, with role names as the key
	 */
	get wantedCreeps() {
		throw new Error("No wanted workforce defined");
	}

	/**
	 * The memory object for this manager
	 */
	get memory() {
		if (this.roomManager.memory.workforceManager === undefined) {
			this.roomManager.memory.workforceManager = {};
		}
		return this.roomManager.memory.workforceManager;
	}

	/**
	 * All creep managers managed by this workforce manager
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
			}).filter(creep => creep !== undefined);
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
	 *
	 * @private
	 */
	_addCreepToWorkforce(name) {
		// Add to the workforce memory array
		this.memory.workforce.push(name);
	}

	/**
	 * Gives managers to unmanaged creeps
	 */
	_makeCreepManagers() {
		// Iterate over the workforce
		this.workforce.forEach(creep => {
			// Find out which manager this creep should have
			let manager = this._determineCreepManager(creep);

			// Manage the creep
			this.creepManagers.push(new manager(creep.name, this));
		});
	}

	/**
	 * Removes a creep from the workforce
	 *
	 * @param {String} creep	The name of the creep
	 *
	 * @private
	 */
	_removeCreepFromWorkforce(name) {
		let i = this.memory.workforce.indexOf(name);
		if (i >= 0) {
			this.memory.workforce.splice(i, 1);
		}
	}

	/**
	 * Map between role name and how many creeps of that type there are
	 */
	getCreepsPerRole({live, inSpawnQueue}) {
		let creepsPerRole = {};

		// Count live creeps, if wanted
		if (live) {
			for (let c of this.workforce) {
				if (creepsPerRole[c.memory.role] === undefined) {
					creepsPerRole[c.memory.role] = 0;
				}
				creepsPerRole[c.memory.role]++;
			}
		}

		// Count creeps in the spawn queue, if wanted
		if (inSpawnQueue) {
			this.spawnManager.spawnQueue.queue.forEach(c => {
				let role = c.initialMemory.role;

				if (creepsPerRole[role] === undefined) {
					creepsPerRole[role] = 0;
				}
				creepsPerRole[role]++;
			});
		}
		
		return creepsPerRole;
	}

	/**
	 * Spawns new creeps if any are missing
	 */
	doSpawning() {
		// Find out which creep types exist
		let creepsPerRole = this.getCreepsPerRole({live: true, inSpawnQueue: true});

		// Iterate over the creep list and see if they are all there
		for (let role in this.wantedCreeps) {
			// Get the existing amount
			let amount = creepsPerRole[role];
			if (amount === undefined) {
				amount = 0;
			}

			// Get or calculate the desired amount
			let desiredAmount = this.wantedCreeps[role].amount;
			if (desiredAmount instanceof Function) {
				desiredAmount = desiredAmount.call(this);
			}

			// Get or calculate priority
			let priority = this.wantedCreeps[role].priority;
			if (priority === undefined) {
				priority = 1000;
			} else if (this.priority instanceof Function) {
				priority = priority.call(this);
			}

			// Check if more are needed
			while (amount < desiredAmount) {
				// Get or calculate the body
				let body = this.wantedCreeps[role].body;
				if (body instanceof Function) {
					body = body.call(this);
				}

				this.spawnManager.addToSpawnQueue({
					body: body,
					initialMemory: {
						role,
						workforce: this.workforceName
					}
				}, priority);
				amount++;
			}
		}
	}

	/**
	 * Search for creeps which should be managed by this manager, but isn't yet
	 *
	 * @private
	 */
	_findAndAddUnmanagedCreeps() {
		this.empireManager.getUnmanagedCreepsFor(this.workforceName).forEach(name => this._addCreepToWorkforce(name));
	}
	

	run() {
		// Look for creeps to put in the workforce
		this._findAndAddUnmanagedCreeps();

		// Give managers to creeps
		this._makeCreepManagers();

		// Activate creeps
		this.creepManagers.forEach(m => m.run());

		// Spawn stuff if the time is right
		if (Game.time % WorkforceManager.checkInterval === 0) {
			this.doSpawning();
		}
	}

	/**
	 * How often the workforce should be checked for missing creeps
	 */
	static get checkInterval() {
		return 5;	// Prime
	}
}

module.exports = WorkforceManager;
