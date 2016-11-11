{
	repairManager: {
		useStoredEnergy: true,
		useTerminalEnergy: false,
		wantedCreeps: {
			repairer: {
				amount: 10
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
	mineralManager: {
		labConfig: {
			"580ced68bf8832bd6b94be34": {	// L X0
				mineralType: RESOURCE_ZYNTHIUM,
				combines: null
			},
			"580cc62349dd75f96ba11f9a": {	// L 0X
				mineralType: RESOURCE_KEANIUM,
				combines: null
			},
			"580b5f7f8ba15518246a9290": {	// L X 00
				mineralType: RESOURCE_OXYGEN,
				combines: null
			},
			"580c9b368c78fc4506282a5a": {	// L 0 X0
				mineralType: RESOURCE_ZYNTHIUM_KEANITE,
				combines: ["580ced68bf8832bd6b94be34", "580cc62349dd75f96ba11f9a"]
			},
			"580c0f906e17d9c03f5c991f": {	// L 0 0X
				mineralType: RESOURCE_UTRIUM,
				combines: null
			},
			"580b7aa4b0e26d77434066f7": {	// U X0 0
				mineralType: RESOURCE_HYDROGEN,
				combines: null
			},
			"580b94f5a5cb227719f92a2a": {	// U 0X 0
				mineralType: RESOURCE_HYDROXIDE,
				combines: ["580b5f7f8ba15518246a9290", "580b7aa4b0e26d77434066f7"]
			},
			"580bf3bc72c41d58697cd11d": {	// U 00 X
				mineralType: RESOURCE_LEMERGIUM,
				combines: null
			},
			"580bb521f80a08fc52afdfbc": {	// U X0
				mineralType: RESOURCE_GHODIUM,
				combines: ["580c9b368c78fc4506282a5a", "580bd36da95836d379d88f3b"]
			},
			"580bd36da95836d379d88f3b": {	// U 0X
				mineralType: RESOURCE_UTRIUM_LEMERGITE,
				combines: ["580c0f906e17d9c03f5c991f", "580bf3bc72c41d58697cd11d"]
			}
		}
	},
	miscWorkforceManager: {
		wantedCreeps: {
			upgrader: {
				amount: 2,
				body: {WORK: 15, MOVE: 15, CARRY: 15}
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
