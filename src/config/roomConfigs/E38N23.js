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
				body: {WORK: 15, MOVE: 15, CARRY: 15}
			}
		}
	},
	armyManager: {
		isWar: false,
		targetRoom: {
			name: "E39N24",
			entryX: 1,
			entryY: 25,
			protectX: 6,
			protectY: 42
		},
		breachpoints: [],
		allies: [],
		wantedCreeps: {
			attacker: {
				amount: 1,
				body: {MOVE: 10, ATTACK: 5, RANGED_ATTACK: 5}
			},
			healer: {
				amount: 1,
				body: {MOVE: 5, HEAL: 5}
			}
		}
	}
}
