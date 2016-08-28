"use strict";

const Manager = require("Manager");

/**
 * Manages the empire's terminals, and transactions between them
 */
class TerminalManager extends Manager {
	/**
	 * A map of all terminals in the empire
	 */
	get terminals() {
		if (this._terminals === undefined) {
			this._terminals = {};
			this.empireManager.roomManagers.forEach(rm => {
				let terminal = rm.energyManager.terminal;
				if (terminal !== undefined) {
					this._terminals[rm.roomName] = terminal;
				}
			});
		}
		return this._terminals;
	}

	run() {
/*
		// Send stuff around if the time is right
		if (Game.time % TerminalManager.sendInterval === 0) {
			let mineralBalance = {};

			// Iterate over all base minerals
			TerminalManager.baseMinerals.forEach(m => {
				// Keep track of which terminals got too much or too little of that mineral
				mineralBalance[m] = {tooMuch: [], tooLittle: []};
				this.terminals.forEach(t => {
					
					// TODO
				});
			});
		}
*/
	}

	/**
	 * Ticks between each time the terminals should send stuff to each other
	 */
	static get sendInterval() {
		return 151;	// Prime
	}

	/**
	 * List of all base minerals
	 */
	static get baseMinerals() {
		return [
			RESOURCE_HYDROGEN,
			RESOURCE_OXYGEN,
			RESOURCE_UTRIUM,
			RESOURCE_LEMERGIUM,
			RESOURCE_KEANIUM,
			RESOURCE_ZYNTHIUM,
			RESOURCE_CATALYST
		];
	}

	/**
	 * Energy buffer to maintain in terminals
	 */
	static get energyBuffer() {
		return 50000;
	}

	/**
	 * Minimum mineral buffer to maintain in terminals
	 */
	static get mineralBuffer() {
		return 20000;
	}
}

module.exports = TerminalManager;
