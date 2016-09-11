"use strict";

const CreepManager = require("CreepManager");

/**
 * A creep which reserves remote rooms
 */
class ReserverCreepManager extends CreepManager {
	/**
	 * Creates a new Energy harvester manager
	 *
	 * @param {String} creepName	Name of the creep to manage
	 * @param {EnergyManager} energyManager	The energy manager this creep is managed by
	 */
	constructor(creepName, reserverManager) {
		super(creepName, reserverManager);

		// Store a reference to the reserver manager
		this.reserverManager = reserverManager;
	}

	/**
	 * Name of the room to reserve
	 */
	get roomToReserve() {
		if (this.memory.roomToReserve === undefined) {
			this.memory.roomToReserve = null;
		}
		return this.memory.roomToReserve;
	}
	set roomToReserve(roomName) {
		this.memory.roomToReserve = roomName;
	}

	run() {
		if (this.roomToReserve === null) {
			// Don't do anything if the creep has no assigned room
			return;
		} else if (this.creep.room.name !== this.roomToReserve) {
			// Go to the room
			this.creep.moveTo(new RoomPosition(25, 25, this.roomToReserve));
		} else {
			// Go reserve the controller
			let controller = this.creep.room.controller;
			if (this.creep.reserveController(controller) !== OK) {
				this.creep.moveTo(controller);
			}
		}
	}

	/**
	 * Calculates a default body for the creep based on an amount of energy
	 */
	static calculateBody(energy) {
		return [MOVE, MOVE, CLAIM, CLAIM];
	}
}

module.exports = ReserverCreepManager;
