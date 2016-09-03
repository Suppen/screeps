"use strict";

const CreepManager = require("CreepManager");

/**
 * A creep class which walks on enemy construction sites, destroying them
 */
class ConstructionSiteDestroyerCreepManager extends CreepManager {
	/**
	 * Creates a new construction site destroyer creep manager
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
			let targets = this.creep.room.find(FIND_CONSTRUCTION_SITES, {
				filter(s) {
					return !s.my;
				}
			});

			if (targets.length > 0) {
				this.creep.moveTo(targets[0]);
			} else {
				// Go defent some point
				this.creep.moveTo(targetRoom.protectX, targetRoom.protectY);
			}
		}
	}
}


module.exports = ConstructionSiteDestroyerCreepManager;
