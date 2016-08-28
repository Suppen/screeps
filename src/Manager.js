"use strict";

/**
 * Base class for all managers
 */
class Manager {
	/**
	 * The empire manager
	 */
	get empireManager() {
		return Game.empireManager;
	}

	/**
	 * Memory of the manager. Must be overridden if used
	 */
	get memory() {
		throw new Error("No memory location defined");
	}

	/**
	 * Logic which runs every tick
	 */
	run() {
		// Empty. Override in subclass
	}
}

module.exports = Manager;
