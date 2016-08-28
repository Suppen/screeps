"use strict";

const Manager = require("Manager");

/**
 * Base class for all creep types
 */
class CreepManager extends Manager {
	/**
	 * Creates a new creep manager for a creep
	 *
	 * @param {String} creepName	The name of the creep to manage
	 * @param {WorkforceManager} workforceManager	The workforce manager this creep is part of
	 */
	constructor(creepName, workforceManager) {
		super();

		/**
		 * The workforce manager this creep is part of
		 */
		this.workforceManager = workforceManager;

		/**
		 * The name of the creep
		 */
		this.creepName = creepName;
	}

	/**
	 * The memory of the creep
	 */
	get memory() {
		if (this.creep.memory === undefined) {
			this.creep.memory = {};
		}
		return this.creep.memory;
	}

	/**
	 * The creep object itself
	 */
	get creep() {
		return Game.creeps[this.creepName];
	}
}

module.exports = CreepManager;
