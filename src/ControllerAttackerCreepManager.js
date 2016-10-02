"use strict";

const CreepManager = require("CreepManager");

/**
 * A creep which attacks enemy controllers
 */
class ControllerAttackerCreepManager extends CreepManager {
	/**
	 * Creates a new manager
	 *
	 * @param {String} creepName	Name of the creep to manage
	 * @param {ArmyManager} armyManager	The army manager this creep is managed by
	 */
	constructor(creepName, armyManager) {
		super(creepName, armyManager);

		// Store a reference to the army manager
		this.armyManager = armyManager;
	}

	run() {
		let targetRoom = this.armyManager.targetRoom;
		if (this.creep.room.name !== targetRoom.name) {
			this.creep.moveTo(new RoomPosition(targetRoom.entryX, targetRoom.entryY, targetRoom.name));
		} else {
			let controller = this.creep.room.controller;

			// Don't attack a friendly controller...
			if (!controller.my) {
				if (this.creep.attackController(controller) !== OK) {
					this.creep.moveTo(controller);
				}
			}
		}
	}
}

module.exports = ControllerAttackerCreepManager;
