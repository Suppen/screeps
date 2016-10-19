"use strict";

const CreepManager = require("CreepManager");

class ClaimerCreepManager extends CreepManager {
	run() {
	    /*
		if (this.creep.pos.x === 47 && this.creep.pos.y === 17 && this.creep.room.name === "E34N21") {
			this.waypointReached = true;
		}

		if (!this.waypointReached) {
			this.creep.moveTo(new RoomPosition(47, 17, "E34N21"));
		} else if (this.waypointReached && this.creep.room.name !== "E34N22") {
			this.creep.moveTo(new RoomPosition(38, 46, "E34N22"));
		} else {
		*/
		if (this.creep.roomName !== "E38N14") {
		    this.creep.moveTo(new RoomPosition(25, 25, "E38N14"));
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
