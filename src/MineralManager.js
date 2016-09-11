"use strict";

const WorkforceManager = require("WorkforceManager");

/**
 * Handles the minerals and reactions for a room
 */
class MineralManager extends WorkforceManager {
	/**
	 * Creates a new mineral manager
	 *
	 * @param {RoomManager} roomManager	The room manager which owns this mineral manager. Must have a spawn manager on it!
	 * @param {Object} config	Configuration for the mineral manager
	 */
	constructor(roomManager, config) {
		super(roomManager.spawnManager);

		/**
		 * The room manager for this mineral manager
		 */
		this.roomManager = roomManager;

		/**
		 * The config for this mineral manager
		 */
		this.config = _.defaults(config, {
			wantedCreeps: {}
		});
	}

	/**
	 * The memory of the mineral manager
	 */
	get memory() {
		if (this.roomManager.memory.mineralManager === undefined) {
			this.roomManager.memory.mineralManager = {};
		}
		return this.roomManager.memory.mineralManager;
	}

	/**
	 * The name of this workforce
	 */
	get workforceName() {
		return this.roomManager.roomName + ".mineralManager";
	}

	/**
	 * Map of creeps wanted for this manager, with role names as the key
	 */
	get wantedCreeps() {
		return this.config.wantedCreeps;
	}

	/**
	 * The mineral type in the room
	 */
	get mineralInRoom() {
		if (this.memory.mineralInRoom === undefined) {
			let mineralArray = this.roomManager.room.lookForAtArea(LOOK_MINERALS, 0, 0, 49, 49, true);
			this.memory.mineralInRoom = mineralArray[0].mineral.id;
		}
		if (this._mineralInRoom === undefined) {
			this._mineralInRoom = Game.getObjectById(this.memory.mineralInRoom);
		}
		return this._mineralInRoom;
	}
}

module.exports = MineralManager;
