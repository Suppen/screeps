{
	repairManager: {
		wantedCreeps: {
			repairer: {
				amount() {
					return this.getRepairTargetId() !== null ? 2 : 0; 
				},
				body: [WORK, WORK, WORK, WORK, WORK, MOVE, MOVE, MOVE, MOVE, MOVE, CARRY, CARRY, CARRY, CARRY, CARRY]
			}
		}
	},
	energyManager: {
		useStoredEnergy: false,
		harvestRemoteSources: true,
		wantedCreeps: {
			energyHarvester: {
				amount() {
					return this.localSources.length;
				},
				body: [WORK, WORK, WORK, WORK, WORK, WORK, MOVE, MOVE, CARRY, CARRY],
				priority: 1
			},
			energyCollector: {
				amount: 2,
				priority: 2
			}
		}
	},
	constructionManager: {
		wantedCreeps: {
			builder: {
				amount() {
					return this.constructionQueue.size ? 1 : 0;
				},
				body: [WORK, WORK, WORK, WORK, MOVE, MOVE, MOVE, MOVE, CARRY, CARRY, CARRY, CARRY]
			}
		}
	},
	miscWorkforceManager: {
		wantedCreeps: {
			upgrader: {
				amount: 3,
				body: [WORK, WORK, WORK, WORK, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, CARRY, CARRY, CARRY, CARRY, CARRY]
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
