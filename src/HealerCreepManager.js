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
			if (this.creep.heal(woundedCreeps[0]) === ERR_NOT_IN_RANGE) {
			    this.creep.rangedHeal(woundedCreeps[0])
				this.creep.moveTo(woundedCreeps[0]);
			}
		}

		if (woundedCreeps.length === 0) {
			let targetRoom = this.armyManager.targetRoom;
			if (this.creep.room.name !== targetRoom.name) {
				// Go to target room if not there
				this.creep.moveTo(new RoomPosition(targetRoom.entryX, targetRoom.entryY, targetRoom.name));
			} else {
				// Stick to a fighter
				let fighters = this.creep.room.find(FIND_MY_CREEPS, {
					filter(c) {
						return c.getActiveBodyparts(ATTACK) > 0 || c.getActiveBodyparts(RANGED_ATTACK);
					}
				});
				if (fighters.length > 0) {
					this.creep.moveTo(fighters[0]);
				}
			}
		}
	}
}


module.exports = HealerCreepManager;
