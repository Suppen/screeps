"use strict";

const WorkforceManager = require("WorkforceManager");
const ScoutManager = require("ScoutManager");

/**
 * Defends a room and its neighbours, when attacked
 */
class DefenderManager extends WorkforceManager {
	/**
	 * Creates a new defender manager
	 *
	 * @param {RoomManager} roomManager	The room manager which owns this workforce manager. Must have a spawn manager on it!
	 * @param {Object} config	Configuration for the defense manager
	 */
	constructor(roomManager, config) {
		super(roomManager.spawnManager);

		/**
		 * The room manager for this workforce manager
		 */
		this.roomManager = roomManager;

		
		/**
		 * The config for this energy manager
		 */
		this.config = _.defaults(config, {
			idleX: 25,
			idleY: 25
		});
	}

	/**
	 * The memory object for this manager
	 */
	get memory() {
		if (this.roomManager.memory.defenderManager === undefined) {
			this.roomManager.memory.defenderManager = {};
		}
		return this.roomManager.memory.defenderManager;
	}

	/**
	 * Name of the workforce
	 */
	get workforceName() {
		return this.roomManager.roomName + ".defenderManager";
	}

	/**
	 * Map of creeps wanted for this manager, with role names as the key
	 */
	get wantedCreeps() {
		let wantedCreeps = {};
		if (this.dangerousNeighbourRooms.length > 0) {
			wantedCreeps.defender = {
				amount: 1,
				body: [TOUGH, TOUGH, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, RANGED_ATTACK, RANGED_ATTACK, ATTACK, ATTACK, ATTACK]
			}
		}
		return wantedCreeps;
	}

	/**
	 * List of neighbour rooms in need of defense
	 */
	get dangerousNeighbourRooms() {
		if (this._dangerousNeighbourRooms === undefined) {
			this._dangerousNeighbourRooms = [];

			let rs = this.roomManager.scoutManager.roomStatuses;
			for (let roomName in rs) {
				let status = rs[roomName].status;
				if (status === ScoutManager.DANGEROUS) {
					this._dangerousNeighbourRooms.push(roomName);
				}
			}
		}

		return this._dangerousNeighbourRooms;
	}

	/**
	 * Which room to defend
	 */
	get roomToDefend() {
		return this.dangerousNeighbourRooms.length > 0 ? this.dangerousNeighbourRooms[0] : this.roomManager.roomName;
	}

	/**
	 * Point to go to in the main room when there is nothing to defend
	 */
	get idlePoint() {
		return new RoomPosition(this.config.idleX, this.config.idleY, this.roomManager.roomName);
	}
}

module.exports = DefenderManager;
