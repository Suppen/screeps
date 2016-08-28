"use strict";

const ResourceHandlingCreepManager = require("ResourceHandlingCreepManager");

class RemoteBuilderCreepManager extends ResourceHandlingCreepManager {
	run() {
		if (this.creep.pos.x === 20 && this.creep.pos.y === 24 && this.creep.room.name === "E34N18") {
			this.waypointReached = true;
		}

		if (this.loadLevel === 0) {
			let storage = this.workforceManager.roomManager.energyManager.storage;
			if (this.creep.withdraw(storage, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
			    this.creep.moveTo(storage);
			}
		} else if (!this.waypointReached) {
			this.creep.moveTo(new RoomPosition(20, 24, "E34N18"));
		} else if (this.waypointReached && this.creep.room.name !== "E36N19") {
			this.creep.moveTo(new RoomPosition(25, 25, "E36N19"));
		} else {
			this.workforceManager._removeCreepFromWorkforce(this.creepName);
			if (Math.random() > 1) {
				this.constructionManager = this.empireManager.roomManagers.E36N19.constructionManager;
				this.creep.memory.role = "builder";
				this.empireManager.addUnmanagedCreep(this.creepName, "E36N19.constructionManager");
			} else {
				this.miscWorkforceManager = this.empireManager.roomManagers.E36N19.miscWorkforceManager;
				this.creep.memory.role = "upgrader";
				this.empireManager.addUnmanagedCreep(this.creepName, "E36N19.miscWorkforce");
			}
		}
	}

	get waypointReached() {
		if (this.memory.waypointReached === undefined) {
			this.memory.waypointReached = false;
		}
		return this.memory.waypointReached;
	}

	set waypointReached(bool) {
		this.memory.waypointReached = bool;
	}
}

module.exports = RemoteBuilderCreepManager;
