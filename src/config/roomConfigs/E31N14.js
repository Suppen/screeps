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
				body: {WORK: 15, MOVE: 1, CARRY: 15}
			}
		}
	},
	defenseManager: {
		idleX: 43,
		idleY: 40
	},
	armyManager: {
		isWar: true,
		targetRoom: {
			name: "E26N9",
			entryX: 1,
			entryY: 29,
			protectX: 17,
			protectY: 23
		},
		breachpoints: [
			"583a64ef906116ef03e74fc3"
		],
		allies: [],
		wantedCreeps: {
			attacker: {
				amount: 2,
				body: {MOVE: 20, ATTACK: 10, RANGED_ATTACK: 10}
			},
			helaer: {
				amount: 2,
				body: {MOVE: 15, HEAL: 15}
			},
			deconstructor: {
				amount: 2,
				body: {MOVE: 25, WORK: 25}
			}
		}
	}
}
