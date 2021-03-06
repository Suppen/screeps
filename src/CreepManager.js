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

	/**
	 * Role name of the creep
	 */
	get role() {
		return this.memory.role;
	}

	/**
	 * True if the creep is in its parent room, false otherwise
	 */
	get isInParentRoom() {
		return this.creep.room.name === this.parentRoomName;
	}

	/**
	 * Name of the parent room
	 */
	get parentRoomName() {
		return this.workforceManager.roomManager.roomName;
	}

	/**
	 * Calculates a default body for the creep based on an amount of energy. Will throw if not overridden
	 */
	static calculateBody(energy) {
		throw new Error("Please override calculateBody in subclasses of CreepManager");
	}
}

module.exports = CreepManager;
