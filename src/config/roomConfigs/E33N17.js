{
	repairManager: {
		wantedCreeps: {
			repairer: {
				amount() {
					return this.getRepairTargetId() !== null ? 2 : 0; 
				},
				body: [WORK, WORK, WORK, WORK, WORK, WORK, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY]
			}
		}
	},
	energyManager: {
		useStoredEnergy: false,
		harvestRemoteSources: true,
		wantedCreeps: {
			energyHarvester: {
				amount() {
					return this.localSources.length;
				},
				body: [WORK, WORK, WORK, WORK, WORK, WORK, MOVE, MOVE, CARRY, CARRY],
				priority: 1
			},
			energyCollector: {
				amount: 2,
				priority: 2
			}
		}
	},
	constructionManager: {
		wantedCreeps: {
			builder: {
				amount() {
					return this.constructionQueue.size ? 2 : 0;
				},
				body: [WORK, WORK, WORK, WORK, WORK, WORK, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY]
			}
		}
	},
	miscWorkforceManager: {
		wantedCreeps: {
			upgrader: {
				amount: 3,
				body: [WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY]
			}
		}
	},
	armyManager: {
		isWar: false,
		targetRoom: {
			name: "E33N16",
			entryX: 30,
			entryY: 1,
			protectX: 15,
			protectY: 31
		},
		breachpoints: [],
		allies: [],
		wantedCreeps: {
			constructionSiteDestroyer: {
				amount: 1,
				body: [MOVE, MOVE, MOVE, MOVE, MOVE]
			}
		}
	}
}
