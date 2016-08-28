"use strict";

module.exports = {
	repairManager: {
		repairer: {
			amount() {
				return this.getRepairTargetId() !== null ? 2 : 0; 
			},
			body: [WORK, WORK, WORK, WORK, MOVE, MOVE, MOVE, MOVE, MOVE, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY]
		}
	},
	energyManager: {
		energyHarvester: {
			amount() {
				return this.sources.length;
			},
			body: [WORK, WORK, WORK, WORK, WORK, WORK, MOVE, MOVE, CARRY, CARRY],
			priority: 1
		},
		energyCollector: {
			amount: 2,
			body: [CARRY, CARRY, MOVE, CARRY, CARRY, MOVE, CARRY, CARRY, MOVE, CARRY, CARRY, MOVE, CARRY, CARRY, MOVE],
			priority: 2
		}
	},
	constructionManager: {
		builder: {
			amount() {
				return this.constructionQueue.size ? 1 : 0;
			},
			body: [WORK, WORK, WORK, WORK, MOVE, CARRY, MOVE, CARRY, CARRY, MOVE, MOVE, CARRY]
		}
	},
	miscWorkforceManager: {
		upgrader: {
			amount: 3,
			body: [WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, MOVE, MOVE, MOVE, CARRY, CARRY]
		},
		attacker2: {
			amount: 0,
			body: [MOVE, MOVE, MOVE, MOVE, MOVE, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK]
		},
		healer2: {
			amount: 0,
			body: [TOUGH, TOUGH, MOVE, MOVE, MOVE, MOVE, MOVE, HEAL, HEAL, HEAL]
		}
	}
};
