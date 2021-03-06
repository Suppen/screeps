"use strict";

const CreepManager = require("CreepManager");

class AttackerCreepManager extends CreepManager {
	/**
	 * Creates a new attacker creep manager
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
		let targetRoom = this.armyManager.targetRoom;
		if (this.creep.room.name !== targetRoom.name) {
			this.creep.moveTo(new RoomPosition(targetRoom.entryX, targetRoom.entryY, targetRoom.name));
		} else {
			let targets = [];

			// Breach breachpoints
			let breachpoint = this.armyManager.getBreachpoint();
			if (breachpoint !== null) {
				targets = [breachpoint];
			}

			// Find dangerous hostile creeps
			let hostiles = this.armyManager.getHostileCreepsIn(this.creep.room.name)
			  .filter(c => c.getActiveBodyparts(ATTACK) !== 0 || c.getActiveBodyparts(RANGED_ATTACK) !== 0 || c.getActiveBodyparts(HEAL) !== 0 || c.getActiveBodyparts(CLAIM) !== 0)

			// If a breachpoint is available, but the creep can shoot and a hostile creep is nearby, go for that instead
			if (targets.length > 0 && this.creep.getActiveBodyparts(RANGED_ATTACK) && hostiles.length > 0) {
				let target = this.creep.pos.findClosestByRange(hostiles);
				if (this.creep.pos.getRangeTo(target) <= 3) {
					// KILL IT!!!!!
					targets = [target];
				}
			}

			// Hostile creeps
			if (targets.length === 0 && hostiles.length !== 0) {
				targets = hostiles;
			}
			// Hostile towers
			if (targets.length === 0) {
				targets = this.creep.room.find(FIND_STRUCTURES, {
					filter(s) {
						return s instanceof StructureTower && !s.my;
					}
				});
			}
			// Hostile spawns
			if (targets.length === 0) {
				targets = this.creep.room.find(FIND_HOSTILE_SPAWNS);
			}
			// Other hostile creeps
			if (targets.length === 0) {
				targets = this.armyManager.getHostileCreepsIn(this.creep.room.name);
			}
			// Structures
			if (targets.length === 0) {
				targets = this.creep.room.find(FIND_STRUCTURES, {
					filter(s) {
						return !(s.my || s instanceof StructureWall || s instanceof StructureRampart || s instanceof StructureRoad || s instanceof StructureController || s instanceof StructureContainer);
					}
				});
			}

			// Do the attack
			if (targets.length > 0) {
				// Go for the closest one
				let target = this.creep.pos.findClosestByRange(targets);
				if (this.creep.attack(target) !== OK) {
					this.creep.moveTo(target);
				}
				// Try to shoot at it
				this.creep.rangedAttack(target);
			} else {
				// Go defend some point
				this.creep.moveTo(targetRoom.protectX, targetRoom.protectY);
			}
		}
	}
}


module.exports = AttackerCreepManager;
