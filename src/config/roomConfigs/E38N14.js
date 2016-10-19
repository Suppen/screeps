{
	repairManager: {
		useStoredEnergy: true,
		wantedCreeps: {
			repairer: {
				amount() {
					return (this.repairQueue.size > 0 || this.unscheduledRepairQueue.length > 0) ? 3 : 0; 
				},
				body: {WORK: 6, MOVE: 6, CARRY: 6}
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
				body: {WORK: 6, MOVE: 1, CARRY: 6}
			}
		}
	},
	defenseManager: {},
	reserverManager: {},
	mineralManager: {
		wantedCreeps: {
			mineralHarvester: {
				amount() {
				    return 0;
					return this.mineralInRoom.mineralAmount > 0 ? 1 : 0;
				},
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
