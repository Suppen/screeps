"use strict";

const CreepManager = require("CreepManager");

class HealerCreepManager extends CreepManager {
	/**
	 * Creates a new healer creep manager
	 *
	 * @param {String} creepName	Name of the creep to manage
	 * @param {ArmyManager} armyManager	Army manager this creep is part of
	 */
	constructor(creepName, armyManager) {
		super(creepName, armyManager);

		// Store the army manager
		this.armyManager = armyManager;
	}

	run() {
		// Find wounded creeps in current room
		let woundedCreeps = this.armyManager.getInjuredCreepsIn(this.creep.room.name);
		if (woundedCreeps.length > 0) {
			// Find the closest one
			let closest = this.creep.pos.findClosestByRange(woundedCreeps);
			if (this.creep.heal(closest) === ERR_NOT_IN_RANGE) {
				this.creep.rangedHeal(closest);
				this.creep.moveTo(closest);
			}
		}

		if (woundedCreeps.length === 0) {
			let targetRoom = this.armyManager.targetRoom;
			if (this.creep.room.name !== targetRoom.name) {
				// Go to target room if not there
				this.creep.moveTo(new RoomPosition(targetRoom.entryX, targetRoom.entryY, targetRoom.name));
			} else {
				// Find all my fighters
				let fighters = this.creep.room.find(FIND_MY_CREEPS, {
					filter(c) {
						return c.getActiveBodyparts(ATTACK) > 0 || c.getActiveBodyparts(RANGED_ATTACK);
					}
				});
				if (fighters.length > 0) {
					// Stick to the closest one
					let closest = this.creep.pos.findClosestByRange(fighters);
					this.creep.moveTo(closest);
				}
			}
		}
	}
}


module.exports = HealerCreepManager;
