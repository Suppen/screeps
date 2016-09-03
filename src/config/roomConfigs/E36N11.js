{
	repairManager: {
		wantedCreeps: {
			repairer: {
				amount() {
					return 0;
					return this.getRepairTargetId() !== null ? 1 : 0; 
				},
				body: [WORK, MOVE, CARRY, CARRY]
			}
		}
	},
	energyManager: {
		useStoredEnergy: false,
		wantedCreeps: {
			energyHarvester: {
				amount() {
					return 0;
					return this.sources.length;
				},
				body: [WORK, MOVE, CARRY, CARRY],
				priority: 1
			},
			energyCollector: {
				amount: 1,
				body: [MOVE, CARRY, CARRY],
				priority: 2
			}
		}
	},
	constructionManager: {
		wantedCreeps: {
			builder: {
				amount() {
					return 0;
					return this.constructionQueue.size > 0 ? 1 : 0;
				},
				body: [WORK, MOVE, CARRY, CARRY],
			}
		}
	},
	miscWorkforceManager: {
		wantedCreeps: {
			upgrader: {
				amount: 0,
				body: [WORK, MOVE, CARRY, CARRY],
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
