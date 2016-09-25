{
	repairManager: {
		useStoredEnergy: false,
		wantedCreeps: {
			repairer: {
				amount() {
					return this.repairQueue.size !== 0 ? 4 : 0; 
				},
				body: [WORK, WORK, WORK, WORK, MOVE, MOVE, MOVE, MOVE, MOVE, CARRY, CARRY, CARRY, CARRY, CARRY]
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
					return this.constructionQueue.size > 0 ? 3 : 0;
				},
				body: [WORK, WORK, WORK, MOVE, MOVE, MOVE, MOVE, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY]
			}
		}
	},
	miscWorkforceManager: {
		wantedCreeps: {
			upgrader: {
				amount: 4,
				body: [WORK, WORK, WORK, WORK, WORK, WORK, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY]
			}
		}
	},
	defenseManager: {
		idleX: 11,
		idleY: 29
	},
	reserverManager: {},
	mineralManager: {},
	armyManager: {
		isWar: false,
		targetRoom: {
			name: "E36N17",
			entryX: 1,
			entryY: 30,
			protectX: 15,
			protectY: 31
		},
		breachpoints: [
			"57a0c7f41b7f4573116446bf"
		],
		allies: [],
		wantedCreeps: {
			attacker: {
				amount: 1,
				body: [MOVE, MOVE, MOVE, MOVE, MOVE, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK]
			}
		}
	}
}
