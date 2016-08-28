"use strict";

const WorkforceManager = require("WorkforceManager");

/**
 * Handles creeps which do not fit in other workforces
 */
class MiscWorkforceManager extends WorkforceManager {
	/**
	 * Creates a new misc workforce manager
	 *
	 * @param {RoomManager} roomManager	The room manager which owns this workforce manager. Must have a spawn manager on it!
	 */
	constructor(roomManager) {
		super(roomManager.spawnManager);

		/**
		 * The room manager for this energy manager
		 */
		this.roomManager = roomManager;
	}

	/**
	 * The memory object for this manager
	 */
	get memory() {
		if (this.roomManager.memory.miscWorkforceManager === undefined) {
			this.roomManager.memory.miscWorkforceManager = {};
		}
		return this.roomManager.memory.miscWorkforceManager;
	}

	/**
	 * Name of the workforce
	 */
	get workforceName() {
		return this.roomManager.roomName + ".miscWorkforce";
	}

	/**
	 * Map of creeps wanted for this manager, with role names as the key
	 */
	get wantedCreeps() {
		return require("wantedCreepsFor" + this.roomManager.roomName).miscWorkforceManager;
	}
}

module.exports = MiscWorkforceManager;
