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
				body: [WORK, WORK, WORK, WORK, WORK, WORK, WORK, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY]
			}
		}
	},
	miscWorkforceManager: {
		wantedCreeps: {
			upgrader: {
				amount: 1,
				body: {WORK: 5, MOVE: 5, CARRY: 5}
			}
		}
	},
	armyManager: {
		isWar: false,
		targetRoom: {
			name: "E37N22",
			entryX: 8,
			entryY: 1,
			protectX: 21,
			protectY: 24
		},
		breachpoints: [],
		allies: [],
		wantedCreeps: {
			deconstructor: {
				amount: 1,
				body: [MOVE, WORK]
			}
		}
	}
}
