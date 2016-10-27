"use strict";

const CreepManager = require("CreepManager");

class ClaimerCreepManager extends CreepManager {
	run() {
		if (this.creep.pos.x === 47 && this.creep.pos.y === 15 && this.creep.room.name === "E29N15") {
			this.waypointReached = true;
		}

		if (!this.waypointReached) {
			this.creep.moveTo(new RoomPosition(47, 15, "E29N15"));
		} else if (this.waypointReached && this.creep.room.name !== "E28N15") {
			this.creep.moveTo(new RoomPosition(23, 24, "E28N15"));
		} else {
		    let controller = this.creep.room.controller;
			if (this.creep.claimController(controller) !== OK) {
				this.creep.moveTo(controller);
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


module.exports = ClaimerCreepManager;
