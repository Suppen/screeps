{
	repairManager: {
		useStoredEnergy: false,
		wantedCreeps: {
			repairer: {
				amount() {
					return (this.repairQueue.size > 0 || this.unscheduledRepairQueue.length > 0) ? 4 : 0; 
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
					return this.constructionQueue.size > 0 ? 2 : 0;
				},
				body: {WORK: 6, MOVE: 6, CARRY: 6}
			}
		}
	},
	miscWorkforceManager: {
		wantedCreeps: {
			upgrader: {
				amount: 3,
				body: {WORK: 8, MOVE: 8, CARRY: 8}
			}
		}
	},
	reserverManager: {},
	mineralManager: {
		wantedCreeps: {
			mineralHarvester: {
				amount() {
					return this.mineralInRoom.mineralAmount > 0 ? 1 : 0;
				},
				body: {WORK: 5, MOVE: 5, CARRY: 5}
			}
		}
	},
	armyManager: {
		isWar: true,
		targetRoom: {
			name: "E36N13",
			entryX: 28,
			entryY: 28,
			protectX: 42,
			protectY: 17
		},
		breachpoints: [],
		allies: [],
		wantedCreeps: {
		}
	}
}
