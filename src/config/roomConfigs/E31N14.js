{
	repairManager: {
		useStoredEnergy: true,
		wantedCreeps: {
			repairer: {
				amount() {
					return (this.repairQueue.size > 0 || this.unscheduledRepairQueue.length > 0) ? 3 : 0; 
				},
				body: {WORK: 8, MOVE: 8, CARRY: 8}
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
				body: {WORK: 6, MOVE: 6, CARRY: 6}
			}
		}
	},
	miscWorkforceManager: {
		wantedCreeps: {
			upgrader: {
				amount: 2,
				body: {WORK: 10, MOVE: 5, CARRY: 10}
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
		isWar: false,
		targetRoom: {
			name: "E32N15",
			entryX: 1,
			entryY: 12,
			protectX: 46,
			protectY: 12
		},
		breachpoints: [],
		allies: [],
		wantedCreeps: {
		}
	}
}
