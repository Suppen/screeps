"use strict";

const CreepManager = require("CreepManager");

class DefenderCreepManager extends CreepManager {
	/**
	 * Creates a new defender creep manager
	 *
	 * @param {String} creepName	Name of the creep to manage
	 * @param {DefenseManager} defenseManager	Defense manager this creep is part of
	 */
	constructor(creepName, defenseManager, armyManager) {
		super(creepName, defenseManager);

		// Store the defense manager
		this.defenseManager = defenseManager;

		// Store the army manager
		this.armyManager = defenseManager.roomManager.armyManager;

		// Store the scout manager
		this.scoutManager = defenseManager.roomManager.scoutManager;
	}

	run() {
		// Room to defend
		let roomToDefend = this.defenseManager.roomToDefend;

		// Go to the room if not there
		if (this.creep.room.name !== roomToDefend) {
			// Always go through the main room, in order to get healed by the towers
			if (this.creep.room.name !== this.defenseManager.roomManager.roomName) {
				this.creep.moveTo(new RoomPosition(25, 25, this.defenseManager.roomManager.roomName));
			} else {
				this.creep.moveTo(new RoomPosition(25, 25, roomToDefend));
			}
		} else {
			let targets = [];

			// Hostile creeps with ATTACK, RANGED_ATTACK, HEAL and/or CLAIM
			if (targets.length === 0) {
				targets = this.armyManager.getHostileCreepsIn(this.creep.room.name)
					.filter(c => c.getActiveBodyparts(ATTACK) !== 0 || c.getActiveBodyparts(RANGED_ATTACK) !== 0 || c.getActiveBodyparts(HEAL) !== 0 || c.getActiveBodyparts(CLAIM) !== 0);
			}

			// Other hostile creeps
			if (targets.length === 0) {
				targets = this.armyManager.getHostileCreepsIn(this.creep.room.name);
			}

			// Do the attack
			if (targets.length > 0) {
				// Go for the closest one
				let target = this.creep.pos.findClosestByRange(targets);
				if (this.creep.attack(target) === ERR_NOT_IN_RANGE) {
					this.creep.moveTo(target);
				}
			} else {
				// Tell the scout manager the room is no longer dangerous
				if (this.creep.room.name !== this.defenseManager.roomManager.roomName && this.scoutManager.roomStatuses[this.creep.room.name].status === this.scoutManager.constructor.DANGEROUS) {
					this.scoutManager.updateRoomStatus(this.creep.room.name);
				}
				this.creep.moveTo(new RoomPosition(25, 25, roomToDefend));
			}
		}
	}
}


module.exports = DefenderCreepManager;
