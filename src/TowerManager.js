"use strict";

const Manager = require("Manager");

/**
 * Handles all towers for a room manager
 */
class TowerManager extends Manager {
	/**
	 * Creates a new tower manager
	 *
	 * @param {RoomManager} roomManager	The room manager this tower manager is part of
	 */
	constructor(roomManager) {
		super();

		/**
		 * The room manager this tower manager is part of
	 	 */
		this.roomManager = roomManager;
	}

	/**
	 * The memory of the tower manager
	 */
	get memory() {
		if (this.roomManager.memory.towerManager === undefined) {
			this.roomManager.memory.towerManager = {};
		}
		return this.roomManager.memory.towerManager;
	}

	/**
	 * All towers in this room
	 */
	get towers() {
		if (this._towers === undefined) {
			this._towers = this.roomManager.room.find(FIND_MY_STRUCTURES, {
				filter(s) {
					return s.structureType == STRUCTURE_TOWER;
				}
			});
		}
		return this._towers;
	}

	run() {
		this.towers.forEach(tower => {
			if (tower.energy >= 10) {
				let enemies = this.roomManager.armyManager.getHostileCreepsIn(this.roomManager.roomName);
				let woundedCreeps = this.roomManager.armyManager.getInjuredCreepsIn(this.roomManager.roomName);
				if (enemies.length > 0) {
					// Shit! Enemies are nearby! Find out who to shoot first
					let enemy = enemies.reduce((closest, current) => {
						current.distance = tower.pos.getRangeTo(current);
						if (current.distance < closest.distance) {
							closest = current;
						}
						return closest;
					}, {distance: Number.MAX_SAFE_INTEGER});
					tower.attack(enemy);
				} else if (woundedCreeps.length > 0) {
					// Heal the wounded!
					tower.heal(woundedCreeps[0]);
				} else if (!this.roomManager.armyManager.isWar) {
					let flags = this.roomManager.room.lookForAt(LOOK_FLAGS, tower);
					let repair = flags.reduce((hasRepairFlag, flag) => {
						return hasRepairFlag || (flag.color === COLOR_PURPLE && flag.secondaryColor === COLOR_PURPLE);
					}, false);
					if (repair && tower.energy >= TowerManager.attackBuffer+10) {	// Always save energy for some shots
						let targetId = this.roomManager.repairManager.getRepairTargetId();
						let target = Game.getObjectById(targetId);
						tower.repair(target);
					}
				}
			}
		});
	}

	/**
	 * How much energy to store for attacking
	 */
	static get attackBuffer() {
		return 500;
	}
}

module.exports = TowerManager;
