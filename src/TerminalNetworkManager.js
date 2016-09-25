"use strict";

const Manager = require("Manager");

/**
 * Handles transactions between all terminals in the empire
 */
class TerminalNetworkManager extends Manager {
	constructor(config) {
		super();

		this.config = _.defaults(config, {});
	}

	/**
	 * The memory object for the terminal network manager
	 */
	get memory() {
		if (this.empireManager.memory.terminalNetworkManager === undefined) {
			this.empireManager.memory.terminalNetworkManager = {};
		}
		return this.empireManager.memory.terminalNetworkManager;
	}

	/**
	 * Minimum amount of each resource to keep in the terminals
	 */
	static get minimumOfEachResource() {
		return 1000;
	}

	/**
	 * Maximum amount of each resource to keep in the terminals
	 */
	static get maximumOfEachResource() {
		return 6000;
	}

	/**
	 * Maximum amount of energy to keep in the terminals
	 */
	static get maxEnergy() {
		return 48000;
	}
}

module.exports = TerminalNetworkManager;
