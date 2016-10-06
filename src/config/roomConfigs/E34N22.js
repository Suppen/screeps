{
	repairManager: {
		useStoredEnergy: false,
		wantedCreeps: {
			repairer: {
				amount() {
					return (this.repairQueue.size > 0 || this.unscheduledRepairQueue.length > 0) ? 3 : 0; 
				},
				body: {WORK: 2, MOVE: 2, CARRY: 4}
			}
		}
	},
	energyManager: {
		useStoredEnergy: false,
		harvestRemoteSources: true,
		wantedCreeps: {
			energyCollector: {
				amount: 1,
				priority: 2
			}
		}
	},
	constructionManager: {
		useStoredEnergy: true,
		wantedCreeps: {
			builder: {
				amount() {
					return this.constructionQueue.size > 0 ? 2 : 0;
				},
				body: {WORK: 2, MOVE: 2, CARRY: 4}
			}
		}
	},
	miscWorkforceManager: {
		wantedCreeps: {
			upgrader: {
				amount: 2,
				body: {WORK: 2, MOVE: 2, CARRY: 4}
			}
		}
	},
	reserverManager: {},
	mineralManager: {},
	armyManager: {
		isWar: false,
		targetRoom: {
			name: "E33N15",
			entryX: 28,
			entryY: 28,
			protectX: 42,
			protectY: 17
		},
		breachpoints: [],
		allies: [],
		wantedCreeps: {}
	}
}
