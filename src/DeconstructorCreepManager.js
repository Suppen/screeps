"use strict";

const CreepManager = require("CreepManager");

/**
 * Creep type which deconstructs enemt structures
 */
class DeconstructorCreepManager extends CreepManager {
	/**
	 * Creates a new deconstructor creep manager
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
				if (this.creep.dismantle(target) !== OK) {
					this.creep.moveTo(target);
				}
			} else {
				// Go defend some point
				this.creep.moveTo(targetRoom.protectX, targetRoom.protectY);
			}
		}
	}
}


module.exports = DeconstructorCreepManager;
