{
	repairManager: {
		useStoredEnergy: false,
		wantedCreeps: {
			repairer: {
				amount() {
					return this.repairQueue.size !== 0 ? 3 : 0; 
				},
				body: [WORK, WORK, WORK, WORK, WORK, WORK, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY]
			}
		}
	},
	energyManager: {
		useStoredEnergy: false,
		harvestRemoteSources: true,
		wantedCreeps: {
			energyCollector: {
				amount: 2,
				priority: 2
			}
		}
	},
	constructionManager: {
		useStoredEnergy: true,
		wantedCreeps: {
			builder: {
				amount() {
					return this.constructionQueue.size > 0 ? 1 : 0;
				},
				body: [WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY]
			}
		}
	},
	miscWorkforceManager: {
		wantedCreeps: {
			upgrader: {
				amount: 2,
				body: [WORK, WORK, WORK, WORK, WORK, WORK, WORK, MOVE, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY]
			}
		}
	},
	defenseManager: {
		idleX: 43,
		idleY: 40
	},
	reserverManager: {},
	mineralManager: {},
	armyManager: {
		isWar: true,
		targetRoom: {
			name: "E32N15",
			entryX: 6,
			entryY: 48,
			protectX: 47,
			protectY: 29
		},
		breachpoints: [],
		allies: [],
		wantedCreeps: {
			attacker: {
				amount: 1,
				body: [MOVE]
			}
		}
	}
}
