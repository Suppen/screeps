"use strict";

const ResourceHandlingCreepManager = require("ResourceHandlingCreepManager");

class RemoteBuilderCreepManager extends ResourceHandlingCreepManager {
	run() {
		if (this.creep.pos.x === 34 && this.creep.pos.y === 17 && this.creep.room.name === "E37N13") {
			this.waypointReached = true;
		}

		if (!this.waypointReached) {
			this.creep.moveTo(new RoomPosition(34, 17, "E37N13"));
		} else if (this.waypointReached && this.creep.room.name !== "E37N14") {
			this.creep.moveTo(new RoomPosition(39, 1, "E37N14"));
		} else {
			this.workforceManager._removeCreepFromWorkforce(this.creepName);
			if (Math.random() > 0) {
				this.constructionManager = this.empireManager.roomManagers.E37N14.constructionManager;
				this.creep.memory.role = "builder";
				this.empireManager.addUnmanagedCreep(this.creepName, "E37N14.constructionManager");
			} else {
				this.miscWorkforceManager = this.empireManager.roomManagers.E37N14.miscWorkforceManager;
				this.creep.memory.role = "upgrader";
				this.empireManager.addUnmanagedCreep(this.creepName, "E37N14.miscWorkforce");
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
