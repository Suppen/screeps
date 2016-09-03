{
	energyManager: {
		useStoredEnergy: false,
		wantedCreeps: {
			energyHarvester: {
				amount() {
					return this.sources.filter(s => s.room === this.roomManager.room).length;
				},
				body: [WORK, WORK, WORK, WORK, WORK, WORK, WORK, MOVE, MOVE, CARRY, CARRY],
				priority: 1
			},
			energyCollector: {
				amount: 2,
				priority: 2
			}
		}
	},
	miscWorkforceManager: {
		wantedCreeps: {
			upgrader: {
				amount: 2,
				body: [WORK, WORK, WORK, WORK, WORK, WORK, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY]
			}
		}
	},
	repairManager: {
		wantedCreeps: {
			repairer: {
				amount() {
					return this.getRepairTargetId() !== null ? 3 : 0; 
				},
				body: [WORK, WORK, WORK, WORK, MOVE, CARRY, MOVE, CARRY, MOVE, CARRY, MOVE, CARRY]
			}
		}
	},
	constructionManager: {
		wantedCreeps: {
			builder: {
				amount() {
					return this.constructionQueue.size ? 3 : 0;
				},
				body: [WORK, WORK, WORK, WORK, WORK, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY]
			}
		}
	},
	armyManager: {
		isWar: false,
		targetRoom: {
			name: "E38N14",
			entryX: 1,
			entryY: 23,
			protectX: 15,
			protectY: 27
		},
		breachpoints: [],
		allies: [],
		wantedCreeps: {
			attacker: {
				amount: 3,
				body: [MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK]
			},
			healer: {
				amount: 2,
				body: [MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, ATTACK, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL]
			}
		}
	}
}
