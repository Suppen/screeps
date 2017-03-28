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
			},
			energyHarvester: {
				amount: 2,
				priority: 1
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
		isWar: true,
		targetRoom: {
			name: "E25N21",
			entryX: 20,
			entryY: 48,
			protectX: 38,
			protectY: 41
		},
		breachpoints: [
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
