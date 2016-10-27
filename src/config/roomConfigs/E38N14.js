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
				body: {WORK: 6, MOVE: 6, CARRY: 6}
			}
		}
	},
	miscWorkforceManager: {
		wantedCreeps: {
			upgrader: {
				amount: 2,
				body: {WORK: 10, MOVE: 1, CARRY: 10}
			}
		}
	},
	defenseManager: {
		idleX: 17,
		idleY: 13
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
