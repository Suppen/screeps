"use strict";

const CreepManager = require("CreepManager");

class ClaimerCreepManager extends CreepManager {
	run() {
		if (this.creep.pos.x === 20 && this.creep.pos.y === 24 && this.creep.room.name === "E34N18") {
			this.waypointReached = true;
		}

		if (!this.waypointReached) {
			this.creep.moveTo(new RoomPosition(20, 24, "E34N18"));
		} else if (this.waypointReached && this.creep.room.name !== "E36N19") {
			this.creep.moveTo(new RoomPosition(25, 25, "E36N19"));
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
