{
	repairManager: {
		wantedCreeps: {
			repairer: {
				amount() {
					return this.getRepairTargetId() !== null ? 2 : 0; 
				},
				body: [WORK, WORK, WORK, MOVE, MOVE, MOVE, CARRY, CARRY, CARRY]
			}
		}
	},
	energyManager: {
		useStoredEnergy: false,
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
			},
			remoteEnergyHarvester: {
				amount() {
					return this.remoteSources.length;
				},
				body: [WORK, WORK, WORK, WORK, WORK, MOVE, MOVE, MOVE]
			},
			remoteEnergyCollector: {
				amount() {
					return this.remoteContainers.length;
				},
				body: [MOVE, CARRY, CARRY, MOVE, CARRY, CARRY, MOVE, CARRY, CARRY, MOVE, CARRY, CARRY, MOVE, CARRY, CARRY, MOVE, CARRY, CARRY]
			}
		}
	},
	constructionManager: {
		wantedCreeps: {
			builder: {
				amount() {
					return this.constructionQueue.size ? 2 : 0;
				},
				body: [WORK, WORK, WORK, MOVE, MOVE, MOVE, MOVE, CARRY, CARRY, MOVE, CARRY, CARRY, MOVE, CARRY, CARRY]
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
