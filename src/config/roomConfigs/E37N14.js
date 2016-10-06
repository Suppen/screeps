{
	repairManager: {
		useStoredEnergy: true,
		wantedCreeps: {
			repairer: {
				amount() {
					return (this.repairQueue.size > 0 || this.unscheduledRepairQueue.length > 0) ? 6 : 0; 
				},
				body: [WORK, WORK, WORK, WORK, WORK, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY]
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
				body: [WORK, WORK, WORK, WORK, WORK, WORK, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY]
			}
		}
	},
	miscWorkforceManager: {
		wantedCreeps: {
			upgrader: {
				amount: 3,
				body: [WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY]
			}
		}
	},
	defenseManager: {},
	reserverManager: {},
	mineralManager: {
		wantedCreeps: {
			mineralHarvester: {
				amount: 1,
				body: {WORK: 10, MOVE: 10, CARRY: 10}
			}
		}
	},
	armyManager: {
		isWar: false,
		targetRoom: {
			name: "E36N13",
			entryX: 1,
			entryY: 25,
			protectX: 35,
			protectY: 12
		},
		breachpoints: [
		],
		allies: [],
		wantedCreeps: {
			deconstructor: {
				amount: 1,
				body: [MOVE, MOVE, MOVE, MOVE, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK]
			}
		}
	}
}
