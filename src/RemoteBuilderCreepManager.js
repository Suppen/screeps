"use strict";

const ResourceHandlingCreepManager = require("ResourceHandlingCreepManager");

class RemoteBuilderCreepManager extends ResourceHandlingCreepManager {
	run() {
		if (this.creep.pos.x === 3 && this.creep.pos.y === 3 && this.creep.room.name === "E30N15") {
			this.waypointReached = true;
		}

		if (!this.waypointReached) {
			this.creep.moveTo(new RoomPosition(3, 3, "E30N15"));
		} else if (this.waypointReached && this.creep.room.name !== "E29N19") {
			this.creep.moveTo(new RoomPosition(25, 25, "E29N19"));
		} else {
			this.workforceManager._removeCreepFromWorkforce(this.creepName);
			if (Math.random() > 0.25) {
				this.constructionManager = this.empireManager.roomManagers.E42N19.constructionManager;
				this.creep.memory.role = "builder";
				this.empireManager.addUnmanagedCreep(this.creepName, "E29N19.constructionManager");
			} else {
				this.miscWorkforceManager = this.empireManager.roomManagers.E29N19.miscWorkforceManager;
				this.creep.memory.role = "upgrader";
				this.empireManager.addUnmanagedCreep(this.creepName, "E29N19.miscWorkforce");
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
