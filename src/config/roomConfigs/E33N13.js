{
	repairManager: {
		useStoredEnergy: true,
		useTerminalEnergy: false
	},
	energyManager: {
		useStoredEnergy: false,
		harvestRemoteSources: true,
		wantedCreeps: {
			energyCollector: {
				amount: 3,
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
				amount: 2,
				body: {WORK: 15, MOVE: 15, CARRY: 15}
			}
		}
	},
	armyManager: {
		isWar: false,
		targetRoom: {
			name: "E33N13",
			entryX: 48,
			entryY: 15,
			protectX: 42,
			protectY: 17
		},
		breachpoints: [],
		allies: [],
		wantedCreeps: {
			deconstructor: {
				amount: 0,
				body: {WORK: 40, MOVE: 10}
			}
		}
	}
}
