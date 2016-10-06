"use strict";

const ResourceHandlingCreepManager = require("ResourceHandlingCreepManager");

class RemoteBuilderCreepManager extends ResourceHandlingCreepManager {
	run() {
		if (this.creep.pos.x === 47 && this.creep.pos.y === 17 && this.creep.room.name === "E34N21") {
			this.waypointReached = true;
		}

		if (!this.waypointReached) {
			this.creep.moveTo(new RoomPosition(47, 17, "E34N21"));
		} else if (this.waypointReached && this.creep.room.name !== "E34N22") {
			this.creep.moveTo(new RoomPosition(38, 46, "E34N22"));
		} else {
			this.workforceManager._removeCreepFromWorkforce(this.creepName);
			if (Math.random() > 1) {
				this.constructionManager = this.empireManager.roomManagers.E34N22.constructionManager;
				this.creep.memory.role = "builder";
				this.empireManager.addUnmanagedCreep(this.creepName, "E34N22.constructionManager");
			} else {
				this.miscWorkforceManager = this.empireManager.roomManagers.E34N22.miscWorkforceManager;
				this.creep.memory.role = "upgrader";
				this.empireManager.addUnmanagedCreep(this.creepName, "E34N22.miscWorkforce");
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
