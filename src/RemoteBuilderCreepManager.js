"use strict";

const ResourceHandlingCreepManager = require("ResourceHandlingCreepManager");

class RemoteBuilderCreepManager extends ResourceHandlingCreepManager {
	run() {
		if (this.creep.pos.x === 47 && this.creep.pos.y === 15 && this.creep.room.name === "E29N15") {
			this.waypointReached = true;
		}

		if (!this.waypointReached) {
			this.creep.moveTo(new RoomPosition(47, 15, "E29N15"));
		} else if (this.waypointReached && this.creep.room.name !== "E28N15") {
			this.creep.moveTo(new RoomPosition(23, 24, "E28N15"));
		} else {
			this.workforceManager._removeCreepFromWorkforce(this.creepName);
			if (Math.random() > 0.5) {
				this.constructionManager = this.empireManager.roomManagers.E28N15.constructionManager;
				this.creep.memory.role = "builder";
				this.empireManager.addUnmanagedCreep(this.creepName, "E28N15.constructionManager");
			} else {
				this.miscWorkforceManager = this.empireManager.roomManagers.E28N15.miscWorkforceManager;
				this.creep.memory.role = "upgrader";
				this.empireManager.addUnmanagedCreep(this.creepName, "E28N15.miscWorkforce");
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
