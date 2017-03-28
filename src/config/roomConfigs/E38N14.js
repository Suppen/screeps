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
				amount: 1,
				body: {WORK: 15, MOVE: 1, CARRY: 15}
			}
		}
	},
	defenseManager: {
		idleX: 17,
		idleY: 13
	},
	armyManager: {
		isWar: true,
		targetRoom: {
			name: "E41N9",
			entryX: 1,
			entryY: 20,
			protectX: 38,
			protectY: 36
		},
		breachpoints: [
			"57c3b7e7220c9e450b511b96"
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
