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
				body: {WORK: 4, MOVE: 4, CARRY: 3}
			}
		}
	},
	miscWorkforceManager: {
		wantedCreeps: {
			upgrader: {
				amount: 4,
				body: {WORK: 4, MOVE: 4, CARRY: 3}
			}
		}
	},
	armyManager: {
		isWar: false,
		targetRoom: {
			name: "E38N23",
			entryX: 1,
			entryY: 25,
			protectX: 22,
			protectY: 24
		},
		breachpoints: [],
		allies: [],
		wantedCreeps: {
			attacker: {
				amount: 2,
				body: {MOVE: 10, ATTACK: 5, RANGED_ATTACK: 5}
			},
			healer: {
				amount: 2,
				body: {MOVE: 10, HEAL: 10}
			}
		}
	}
}
