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
				amount: 3,
				body: {WORK: 8, MOVE: 8, CARRY: 8}
			}
		}
	},
	armyManager: {
		isWar: true,
		targetRoom: {
			name: "E29N15",
			entryX: 48,
			entryY: 15,
			protectX: 42,
			protectY: 17
		},
		breachpoints: [
			"565ff02f76538ea04e0e7b6f",
			"561fa684e39e546e3ba3af42",
			"567aa91d113aa2c835cd7812",
			"567aa83a7a001e9a3e20552e"
		],
		allies: [],
		wantedCreeps: {
			deconstructor: {
				amount: 2,
				body: {WORK: 25, MOVE: 25}
			}
		}
	}
}
