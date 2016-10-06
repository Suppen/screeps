{
	repairManager: {
		useStoredEnergy: false,
		wantedCreeps: {
			repairer: {
				amount() {
					return (this.repairQueue.size > 0 || this.unscheduledRepairQueue.length > 0) ? 2 : 0; 
				},
				body: [WORK, WORK, WORK, WORK, WORK, WORK, WORK, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY]
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
				body: [WORK, WORK, WORK, WORK, WORK, WORK, WORK, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY]
			}
		}
	},
	miscWorkforceManager: {
		wantedCreeps: {
			upgrader: {
				amount: 2,
				body: [WORK, WORK, WORK, WORK, WORK, WORK, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY]
			},
			remoteBuilder: {
				amount: 1,
				body: [WORK, WORK, WORK, WORK, WORK, MOVE, MOVE, MOVE, MOVE, MOVE, CARRY, CARRY, CARRY, CARRY, CARRY]
			}
		}
	},
	reserverManager: {},
	mineralManager: {
		wantedCreeps: {
			mineralHarvester: {
				amount: 1,
				body: [WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY]
			}
		}
	},
	armyManager: {
		isWar: true,
		targetRoom: {
			name: "E34N22",
			entryX: 8,
			entryY: 1,
			protectX: 21,
			protectY: 24
		},
		breachpoints: [],
		allies: [],
		wantedCreeps: {
			attacker: {
				amount: 1,
				body: {MOVE: 5, ATTACK: 5}
			},
			healer: {
				amount: 1,
				body: [MOVE, HEAL]
			}
		}
	}
}
