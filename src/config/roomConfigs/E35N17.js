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
				body: [WORK, WORK, WORK, MOVE, MOVE, MOVE, MOVE, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY]
			}
		}
	},
	miscWorkforceManager: {
		wantedCreeps: {
			upgrader: {
				amount: 3,
				body: {WORK: 20, MOVE: 10, CARRY: 20}
			}
		}
	},
	defenseManager: {
		idleX: 11,
		idleY: 29
	},
	armyManager: {
		isWar: false,
		targetRoom: {
			name: "E35N15",
			entryX: 23,
			entryY: 1,
			protectX: 22,
			protectY: 3
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
				body: {MOVE: 10, HEAL: 10}
			}
		}
	}
}
