"use strict";

const ResourceHandlingCreepManager = require("ResourceHandlingCreepManager");

class RemoteBuilderCreepManager extends ResourceHandlingCreepManager {
	run() {
		if (this.creep.pos.x === 23 && this.creep.pos.y === 21 && this.creep.room.name === "E33N11") {
			this.waypointReached = true;
		}

		if (this.loadLevel === 0) {
			let storage = this.workforceManager.roomManager.energyManager.storage;
			if (this.creep.withdraw(storage, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
			    this.creep.moveTo(storage);
			}
		} else if (!this.waypointReached) {
			this.creep.moveTo(new RoomPosition(25, 24, "E33N11"));
		} else if (this.waypointReached && this.creep.room.name !== "E36N11") {
			this.creep.moveTo(new RoomPosition(25, 25, "E36N11"));
		} else {
			this.workforceManager._removeCreepFromWorkforce(this.creepName);
			if (Math.random() > 0) {
				this.constructionManager = this.empireManager.roomManagers.E36N19.constructionManager;
				this.creep.memory.role = "builder";
				this.empireManager.addUnmanagedCreep(this.creepName, "E36N11.constructionManager");
			} else {
				this.miscWorkforceManager = this.empireManager.roomManagers.E36N19.miscWorkforceManager;
				this.creep.memory.role = "upgrader";
				this.empireManager.addUnmanagedCreep(this.creepName, "E36N11.miscWorkforce");
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
