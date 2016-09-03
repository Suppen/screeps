"use strict";

// Automatically generated file. Do not manually modify

module.exports = {
	roomConfigs: {
		E31N14: {
			energyManager: {
				useStoredEnergy: false,
				wantedCreeps: {
					energyHarvester: {
						amount() {
							return this.sources.length;
						},
						body: [WORK, WORK, WORK, WORK, WORK, WORK, WORK, MOVE, MOVE, CARRY],
						priority: 1
					},
					energyCollector: {
						amount: 2,
						priority: 2
					}
				}
			},
			miscWorkforceManager: {
				wantedCreeps: {
					upgrader: {
						amount: 2,
						body: [WORK, WORK, WORK, WORK, WORK, WORK, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY]
					}
				}
			},
			repairManager: {
				wantedCreeps: {
					repairer: {
						amount() {
							return this.getRepairTargetId() !== null ? 1 : 0; 
						},
						body: [WORK, WORK, WORK, WORK, MOVE, CARRY, MOVE, CARRY, MOVE, CARRY, MOVE, CARRY]
					}
				}
			},
			constructionManager: {
				wantedCreeps: {
					builder: {
						amount() {
							return this.constructionQueue.size ? 1 : 0;
						},
						body: [WORK, WORK, WORK, WORK, MOVE, CARRY, MOVE, CARRY, CARRY, MOVE, MOVE, CARRY]
					}
				}
			},
			armyManager: {
				isWar: false,
				targetRoom: {
					name: "E38N14",
					entryX: 1,
					entryY: 23,
					protectX: 15,
					protectY: 27
				},
				breachpoints: [],
				allies: [],
				wantedCreeps: {
					attacker: {
						amount: 3,
						body: [MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK]
					},
					healer: {
						amount: 2,
						body: [MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, ATTACK, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL]
					}
				}
			}
		},
		E33N13: {
			repairManager: {
				wantedCreeps: {
					repairer: {
						amount() {
							return this.getRepairTargetId() !== null ? 1 : 0; 
						},
						body: [WORK, WORK, WORK, WORK, MOVE, MOVE, MOVE, MOVE, MOVE, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY]
					}
				}
			},
			energyManager: {
				useStoredEnergy: false,
				wantedCreeps: {
					energyHarvester: {
						amount() {
							return this.sources.length;
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
							return this.constructionQueue.size > 0 ? 1 : 0;
						},
						body: [WORK, WORK, WORK, WORK, WORK, WORK, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY]
					}
				}
			},
			miscWorkforceManager: {
				wantedCreeps: {
					upgrader: {
						amount: 3,
						body: [WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY]
					}
				}
			},
			armyManager: {
				isWar: false,
				targetRoom: {
					name: "E38N14",
					entryX: 1,
					entryY: 23,
					protectX: 15,
					protectY: 27
				},
				breachpoints: [],
				allies: [],
				wantedCreeps: {
					attacker: {
						amount: 3,
						body: [MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK]
					},
					healer: {
						amount: 2,
						body: [MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, ATTACK, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL]
					}
				}
			}
		},
		E33N17: {
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
							return this.sources.length;
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
							return this.constructionQueue.size ? 1 : 0;
						},
						body: [WORK, WORK, WORK, MOVE, MOVE, MOVE, CARRY, CARRY, CARRY, CARRY, CARRY, MOVE, CARRY]
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
					name: "E38N14",
					entryX: 1,
					entryY: 23,
					protectX: 15,
					protectY: 27
				},
				breachpoints: [],
				allies: [],
				wantedCreeps: {
					attacker: {
						amount: 3,
						body: [MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK]
					},
					healer: {
						amount: 2,
						body: [MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, ATTACK, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL]
					}
				}
			}
		},
		E36N11: {
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
							return this.sources.length;
						},
						body: [WORK, WORK, WORK, MOVE, MOVE, CARRY, CARRY, CARRY],
						priority: 1
					},
					energyCollector: {
						amount: 1,
						priority: 2
					}
				}
			},
			constructionManager: {
				wantedCreeps: {
					builder: {
						amount() {
							return this.constructionQueue.size > 0 ? 3 : 0;
						},
						body: [WORK, WORK, WORK, MOVE, MOVE, CARRY, CARRY, CARRY]
					}
				}
			},
			miscWorkforceManager: {
				wantedCreeps: {
					upgrader: {
						amount: 0,
						body: [WORK, WORK, WORK, MOVE, MOVE, CARRY, CARRY, CARRY]
					}
				}
			},
			armyManager: {
				isWar: false,
				targetRoom: {
					name: "E38N14",
					entryX: 1,
					entryY: 23,
					protectX: 15,
					protectY: 27
				},
				breachpoints: [],
				allies: [],
				wantedCreeps: {
					attacker: {
						amount: 3,
						body: [MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK]
					},
					healer: {
						amount: 2,
						body: [MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, ATTACK, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL]
					}
				}
			}
		},
		E36N19: {
			repairManager: {
				wantedCreeps: {
					repairer: {
						amount() {
							return this.getRepairTargetId() !== null ? 2 : 0; 
						},
						body: [WORK, WORK, WORK, WORK, WORK, MOVE, MOVE, MOVE, MOVE, MOVE, CARRY, CARRY, CARRY, CARRY, CARRY]
					}
				}
			},
			energyManager: {
				useStoredEnergy: false,
				wantedCreeps: {
					energyHarvester: {
						amount() {
							return this.sources.length;
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
							return this.constructionQueue.size ? 1 : 0;
						},
						body: [WORK, WORK, WORK, WORK, MOVE, MOVE, MOVE, MOVE, CARRY, CARRY, CARRY, CARRY]
					}
				}
			},
			miscWorkforceManager: {
				wantedCreeps: {
					upgrader: {
						amount: 3,
						body: [WORK, WORK, WORK, WORK, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, CARRY, CARRY, CARRY, CARRY, CARRY]
					}
				}
			},
			armyManager: {
				isWar: false,
				targetRoom: {
					name: "E38N14",
					entryX: 1,
					entryY: 23,
					protectX: 15,
					protectY: 27
				},
				breachpoints: [],
				allies: [],
				wantedCreeps: {
					attacker: {
						amount: 3,
						body: [MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK]
					},
					healer: {
						amount: 2,
						body: [MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, ATTACK, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL]
					}
				}
			}
		}
	}
};