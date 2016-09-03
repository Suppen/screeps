"use strict";

module.exports = {
	repairManager: {
		repairer: {
			amount() {
				return 0;
				return this.getRepairTargetId() !== null ? 1 : 0; 
			},
			body: [WORK, MOVE, CARRY, CARRY]
		}
	},
	energyManager: {
		energyHarvester: {
			amount() {
				return 0;
				return this.sources.length;
			},
			body: [WORK, MOVE, CARRY, CARRY],
			priority: 1
		},
		energyCollector: {
			amount: 1,
			body: [MOVE, CARRY, CARRY],
			priority: 2
		}
	},
	constructionManager: {
		builder: {
			amount() {
				return 0;
				return this.constructionQueue.size > 0 ? 1 : 0;
			},
			body: [WORK, MOVE, CARRY, CARRY],
		}
	},
	miscWorkforceManager: {
		upgrader: {
			amount: 0,
			body: [WORK, MOVE, CARRY, CARRY],
		}
	}
};
