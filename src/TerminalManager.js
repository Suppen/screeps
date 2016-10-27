"use strict";

const Manager = require("Manager");

/**
 * Handles the terminal for a room
 */
class TerminalManager extends Manager {
	constructor(roomManager, config) {
		super();

		// Store the room manager
		this.roomManager = roomManager
	}

	/**
	 * The memory of the terminal manager
	 */
	get memory() {
		if (this.roomManager.memory.terminalManager === undefined) {
			this.roomManager.memory.terminalManager = {};
		}
		return this.roomManager.memory.terminalManager;
	}

	/**
	 * The terminal structure
	 */
	get terminal() {
if (this.roomManager.roomName === "E36N11") {
	return undefined;
}
		if (this._terminal === undefined) {
			this._terminal = this.roomManager.room.terminal;
		}
		return this._terminal;
	}

	/**
	 * Minimum amount of each resource to keep in the terminals
	 */
	get minimumOfEachResource() {
		return 1000;
	}

	/**
	 * Maximum amount of each resource to keep in the terminals
	 */
	get maximumOfEachResource() {
		return 6000;
	}

	/**
	 * Maximum amount of energy to keep in the terminals
	 */
	get maxEnergy() {
		return 100000;
	}

	/**
	 * Minimum amount of energy to keep in the terminals
	 */
	get minEnergy() {
		return 20000;
	}

	/**
	 * Map of which resources are abundant, and by how much
	 */
	get abundantResources() {
		// Check if this data is cached
		if (this._abundantResources === undefined) {
			this._abundantResources = {};

			// Check if a terminal even exists in the room
			if (this.terminal !== undefined) {
				// A terminal exists. Calculate abundant resources
				this._abundantResources = {};
				for (let resourceType in this.terminal.store) {
					// Check if the terminal has much of this resource
					if (this.terminal.store[resourceType] > this.minimumOfEachResource) {
						// Store how much extra of this resource the terminal has
						this._abundantResources[resourceType] = this.terminal.store[resourceType] - this.minimumOfEachResource;
					}
				}

				// Check energy separately
				delete this._abundantResources[RESOURCE_ENERGY];
				if (this.terminal.store[RESOURCE_ENERGY] > this.minEnergy) {
					this._abundantResources[RESOURCE_ENERGY] = this.terminal.store[RESOURCE_ENERGY] - this.minEnergy;
				}
			}
		}

		return this._abundantResources;
	}

	/**
	 * Map of which resources are scarce, and by how much
	 */
	get scarceResources() {
		// Check if this data is cached
		if (this._scarceResources === undefined) {
			this._scarceResources = {};

			// Check if a terminal even exists in the room
			if (this.terminal !== undefined) {
				// Check all resource types
				for (let resourceType of RESOURCES_ALL) {
					// Check if the terminal has little of this resource
					let amount = this.terminal.store[resourceType] || 0;
					if (amount < this.minimumOfEachResource) {
						// Store how much more of this resource the terminal needs
						this._scarceResources[resourceType] = this.minimumOfEachResource - amount;
					}
				}


				// Check energy separately
				delete this._scarceResources[RESOURCE_ENERGY];
				if (this.terminal.store[RESOURCE_ENERGY] < this.minEnergy) {
					this._scarceResources[RESOURCE_ENERGY] = this.minEnergy - this.terminal.store[RESOURCE_ENERGY];
				}
			}
		}

		return this._scarceResources;
	}
}

module.exports = TerminalManager;
