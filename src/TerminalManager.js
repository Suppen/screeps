"use strict";

const Manager = require("Manager");

/**
 * Handles the terminal for a room
 */
class TerminalManager extends Manager {
	constructor(roomManager) {
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

	run() {
		// Don't do anything if the terminal doesn't exist
		if (this.terminal !== undefined) {

		}
	}
}

module.exports = TerminalManager;
