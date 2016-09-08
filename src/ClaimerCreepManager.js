"use strict";

const CreepManager = require("CreepManager");

class ClaimerCreepManager extends CreepManager {
	run() {
		if (this.creep.pos.x === 14 && this.creep.pos.y === 24 && this.creep.room.name === "E34N17") {
			this.waypointReached = true;
		}

		if (!this.waypointReached) {
			this.creep.moveTo(new RoomPosition(14, 24, "E34N17"));
		} else if (this.waypointReached && this.creep.room.name !== "E35N17") {
			this.creep.moveTo(new RoomPosition(25, 25, "E35N17"));
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
