{
	repairManager: {
		useStoredEnergy: true,
		useTerminalEnergy: false,
		wantedCreeps: {
			repairer: {
				amount: 8
			}
		}
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
				amount: 2,
				body: {WORK: 15, MOVE: 10, CARRY: 15}
			}
		}
	},
	defenseManager: {
		idleX: 11,
		idleY: 29
	},
	armyManager: {
		isWar: true,
		targetRoom: {
			name: "E34N18",
			entryX: 40,
			entryY: 48,
			protectX: 19,
			protectY: 22
		},
		breachpoints: [
			"57e40c02256ea9355ac9b639",
			"582220f33313e7c152925ba2"
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
