{
	repairManager: {
		useStoredEnergy: false,
		wantedCreeps: {
			repairer: {
				amount() {
					return (this.repairQueue.size > 0 || this.unscheduledRepairQueue.length > 0) ? 4 : 0; 
				},
				body: [WORK, WORK, WORK, WORK, WORK, WORK, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY]
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
					return this.constructionQueue.size > 0 ? 1 : 0;
				},
				body: {WORK: 12, MOVE: 12, CARRY: 12}
			}
		}
	},
	miscWorkforceManager: {
		wantedCreeps: {
			upgrader: {
				amount: 4,
				body: {WORK: 15, MOVE: 15, CARRY: 15}
			}
		}
	},
	defenseManager: {
		idleX: 11,
		idleY: 29
	},
	reserverManager: {},
	mineralManager: {
		wantedCreeps: {
			mineralHarvester: {
				amount() {
					return this.mineralInRoom.mineralAmount > 0 ? 1 : 0;
				},
				body: [WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY]
			}
		}
	},
	armyManager: {
		isWar: false,
		targetRoom: {
			name: "E33N16",
			entryX: 28,
			entryY: 1,
			protectX: 33,
			protectY: 46
		},
		breachpoints: [],
		allies: [],
		wantedCreeps: {
			controllerAttacker: {
				amount: 1,
				body: [MOVE, MOVE, MOVE, MOVE, MOVE, CLAIM, CLAIM, CLAIM, CLAIM, CLAIM]
			},
			attacker: {
				amount: 1,
				body: [MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, ATTACK, ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK]
			}
		}
	}
}
