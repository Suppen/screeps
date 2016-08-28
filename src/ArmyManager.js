"use strict";

const WorkforceManager = require("WorkforceManager");

const ArmyConfig = require("ArmyConfig");

class ArmyManager extends WorkforceManager {
	/**
	 * Creates a new army manager
	 *
	 * @param {RoomManager} roomManager	The room manager which owns this army. Must have a spawn manager on it!
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
		if (this.roomManager.memory.armyManager === undefined) {
			this.roomManager.memory.armyManager = {};
		}
		return this.roomManager.memory.armyManager;
	}

	/**
	 * Name of the workforce
	 */
	get workforceName() {
		return this.roomManager.roomName + ".army";
	}

	/**
	 * Config for this army
	 */
	get config() {
		let defaults = {
			isWar: false,
			useStoredEnergy: false,
			targetRoom: null,
			breachpoints: [],
			allies: [],
			wantedCreeps: {}
		};
		let config = null;
		if (ArmyConfig[this.roomManager.roomName] === undefined) {
			config = _.clone(defaults);
		} else {
			config = _.defaults(ArmyConfig[this.roomManager.roomName], defaults);
		}
		return config;
	}

	/**
	 * Wether or not energy collectors should use energy from the storage
	 */
	get useStoredEnergy() {
		return this.isWar && this.config.useStoredEnergy;
	}

	/**
	 * Boolean telling wether or not the room is at war
	 */
	get isWar() {
		return this.config.isWar;
	}

	/**
	 * The room to attack
	 *
	 * @property {String} name	Name of the room
	 * @property {Integer} entryX	X coordinate to path to in the room
	 * @property {Integer} entryY	Y coordinate to path to in the room
	 * @property {Integer} protectX	X coordinate to go to when there are no targets in the room
	 * @property {Integer} protectY	Y coordinate to go to when there are no targets in the room
	 */
	get targetRoom() {
		return this.config.targetRoom;
	}

	/**
	 * Breachpoint to destroy in target room
	 */
	getBreachpoint() {
		let breachpoint	= null;
		for (let i = 0; i < this.config.breachpoints.length && breachpoint == null; i++) {
			breachpoint = Game.getObjectById(this.config.breachpoints[i]);
		}
		return breachpoint;
	}

	/**
	 * Finds all hostile creeps in a room. Filters out creeps belonging to allies
	 *
	 * @param {String} roomName	Room to find hostiles in. Must have visibility of the room
	 *
	 * @return {Creep[]}	Array of all hostile creeps in the room
	 */
	getHostileCreepsIn(roomName) {
		if (this._hostileCreeps === undefined) {
			this._hostileCreeps = {};
		}
		if (this._hostileCreeps[roomName] === undefined) {
			this._hostileCreeps[roomName] = [];

			// Find all hostile creeps in the room
			if (Game.rooms[roomName] !== undefined) {
				this._hostileCreeps[roomName] = Game.rooms[roomName].find(FIND_HOSTILE_CREEPS, {
					// Filter out allies
					filter: c => this.config.allies.indexOf(c.owner.username) < 0
				});
			}
		}
		return this._hostileCreeps[roomName];
	}

	/**
	 * Finds all injured creeps in a room. Includes creeps belonging to allies
	 *
	 * @param {String} roomName	Room to find injured creeps in. Must have visibility of the room
	 *
	 * @return {Creep[]}	Array of all injured creeps in the room
	 */
	getInjuredCreepsIn(roomName) {
		if (this._injuredCreeps === undefined) {
			this._injuredCreeps = {};
		}
		if (this._injuredCreeps[roomName] === undefined) {
			this._injuredCreeps[roomName] = [];

			// Find all injured creeps in the room
			if (Game.rooms[roomName] !== undefined) {
				this._injuredCreeps[roomName] = Game.rooms[roomName].find(FIND_CREEPS, {
					filter: c => c.hits < c.hitsMax && (c.my || this.config.allies.indexOf(c.owner.usename) >= 0)
				});
			}
		}
		return this._injuredCreeps[roomName];
	}

	/**
	 * Map of creeps wanted for this manager, with role names as the key
	 */
	get wantedCreeps() {
		let wantedCreeps = {};
		if (this.isWar) {
			wantedCreeps = this.config.wantedCreeps;
		}
		return wantedCreeps;
	}
}

module.exports = ArmyManager;
