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
		if (this._terminal === undefined) {
			this._terminal = this.roomManager.terminal;
		}
		return this._terminal;
	}

}

module.exports = TerminalManager;
