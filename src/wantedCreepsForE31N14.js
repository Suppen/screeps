"use strict";

module.exports = {
	repairManager: {
		repairer: {
			amount() {
				return this.getRepairTargetId() !== null ? 1 : 0; 
			},
			body: [WORK, WORK, WORK, WORK, MOVE, CARRY, MOVE, CARRY, MOVE, CARRY, MOVE, CARRY]
		}
	},
	energyManager: {
		energyHarvester: {
			amount() {
				return this.sources.length;
			},
			body: [WORK, WORK, WORK, WORK, WORK, WORK, WORK, MOVE, MOVE, CARRY],
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
			amount: 2,
			body: [WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, MOVE, MOVE, MOVE, CARRY, CARRY]
		}
	}
};
