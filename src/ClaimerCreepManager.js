"use strict";

const CreepManager = require("CreepManager");

class ClaimerCreepManager extends CreepManager {
	run() {
		if (this.creep.pos.x === 3 && this.creep.pos.y === 3 && this.creep.room.name === "E30N15") {
			this.waypointReached = true;
		}

		if (!this.waypointReached) {
			this.creep.moveTo(new RoomPosition(3, 3, "E30N15"));
		} else if (this.waypointReached && this.creep.room.name !== "E29N19") {
			this.creep.moveTo(new RoomPosition(25, 25, "E29N19"));
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
