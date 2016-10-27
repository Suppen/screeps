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
					return this.constructionQueue.size > 0 ? 1 : 0;
				},
				body: {WORK: 6, MOVE: 6, CARRY: 6}
			}
		}
	},
	miscWorkforceManager: {
		wantedCreeps: {
			upgrader: {
				amount: 1,
				body: {WORK: 10, MOVE: 5, CARRY: 10}
			}
		}
	},
	defenseManager: {
		idleX: 43,
		idleY: 40
	},
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
