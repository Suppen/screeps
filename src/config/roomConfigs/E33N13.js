{
	repairManager: {
		useStoredEnergy: false
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
	mineralManager: {},
	armyManager: {
		isWar: false,
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
