"use strict";

const CreepManager = require("CreepManager");

class ClaimerCreepManager extends CreepManager {
	run() {
		if (this.creep.pos.x === 34 && this.creep.pos.y === 17 && this.creep.room.name === "E37N13") {
			this.waypointReached = true;
		}

		if (!this.waypointReached) {
			this.creep.moveTo(new RoomPosition(34, 17, "E37N13"));
		} else if (this.waypointReached && this.creep.room.name !== "E37N14") {
			this.creep.moveTo(new RoomPosition(39, 1, "E37N14"));
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
