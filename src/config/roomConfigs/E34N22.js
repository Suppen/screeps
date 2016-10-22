{
	repairManager: {
		useStoredEnergy: false,
		wantedCreeps: {
			repairer: {
				amount() {
					return (this.repairQueue.size > 0 || this.unscheduledRepairQueue.length > 0) ? 3 : 0; 
				},
				body: {WORK: 9, MOVE: 9, CARRY: 9}
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
				body: {WORK: 6, MOVE: 6, CARRY: 6}
			}
		}
	},
	miscWorkforceManager: {
		wantedCreeps: {
			upgrader: {
				amount: 3,
				body: {WORK: 9, MOVE: 9, CARRY: 9}
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
