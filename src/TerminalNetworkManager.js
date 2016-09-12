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
		
	}
}

module.exports = TerminalNetworkManager;
