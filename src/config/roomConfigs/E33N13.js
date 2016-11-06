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
				amount: 3,
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
				amount: 2,
				body: {WORK: 15, MOVE: 15, CARRY: 15}
			}
		}
	},
	armyManager: {
		isWar: true,
		targetRoom: {
			name: "E33N13",
			entryX: 48,
			entryY: 15,
			protectX: 42,
			protectY: 17
		},
		breachpoints: [
			"5786ad67a48083521e52d1e9",
			"5786adae174fa67817739a51",
			"5786ad740aaa74a475ed9b47",
			"5786ad8e19e9d5903dc9ebcb",
			"5786ad951991ddbe5093c937",
			"5786a7b85b48510d516f19a0",
			"5786a7be9ade9ef947ee5661",
			"5786a7bb3029486273a7d65e",
			"5786a7c55637379f3d21f6e2",
			"5786a7c1174fa6781773961f",
			"5786a7cb993fca633dc8c0f8",
			"5786a7c834a7da3317065f1f",
			"5786a7ae784d20fe50168052",
			"5786a7e99578a6c450aecbaf",
			"5786a7f2838ac48675207dd5",
			"5786a7ef9d10f0ef47e6c7c0",
			"5786a8067e97ebaa563f5b7e",
			"5786a8095c47cc8c569622c4",
			"5786a80ca48083521e52cdd3",
			"5786a80f1991ddbe5093c4bc",
			"5786a7ff5c47cc8c569622b7",
			"5786a81651095c7673862a61",
			"5786a8131991ddbe5093c4c1",
			"5786a8205637379f3d21f711",
			"5786a81ccc7a4c1d4861e990",
			"5786a843e223357a1ecc80c8",
			"5786a8525619a3621e6d5d5f",
			"5786a8599d10f0ef47e6c815",
			"5786a8569d10f0ef47e6c810",
			"5786a85c174fa6781773969d",
			"5786a797838ac48675207d87",
			"5786a794341d60907547a80e",
			"5786a7913029486273a7d63f"
		],
		allies: [],
		wantedCreeps: {
			deconstructor: {
				amount: 1,
				body: {WORK: 40, MOVE: 10}
			}
		}
	}
}
