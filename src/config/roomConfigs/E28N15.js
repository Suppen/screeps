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
				body: {WORK: 4, MOVE: 4, CARRY: 4}
			}
		}
	},
	miscWorkforceManager: {
		wantedCreeps: {
			upgrader: {
				amount: 4,
				body: {WORK: 4, MOVE: 4, CARRY: 4}
			}
		}
	},
	armyManager: {
		isWar: false,
		targetRoom: {
			name: "E29N15",
			entryX: 48,
			entryY: 15,
			protectX: 42,
			protectY: 17
		},
		breachpoints: [],
		allies: [],
		wantedCreeps: {}
	}
}
