"use strict";

const CreepManager = require("CreepManager");

/**
 * Lightweight creep which just goes to rooms and stays there to provide visibility
 */
class ScoutCreepManager extends CreepManager {
	constructor(creepName, scoutManager) {
		super(creepName, scoutManager);

		// Store a reference to the scout manager
		this.scoutManager = scoutManager;
	}

	/**
	 * The room the scout is set to scout
	 */
	get nameOfRoomToScout() {
		if (this.memory.nameOfRoomToScout === undefined) {
			this.memory.nameOfRoomToScout = null;
		}
		return this.memory.nameOfRoomToScout;
	}
	set nameOfRoomToScout(roomName) {
		this.memory.roomToScout = roomName;
	}

	run() {
		this.scoutManager.roomStatuses[this.nameOfRoomToScout].scoutAssigned = this.creepName;

		if (this.creep.room.name !== this.nameOfRoomToScout) {
			this.creep.moveTo(new RoomPosition(25, 25, this.nameOfRoomToScout));
		} else {
			// Move the creep out of the exit zone, and register status immediately if the creep just entered the room
			let updateStatus = 1;
			if (this.creep.pos.x === 0) {
				updateStatus = this.creep.move(RIGHT);
			} else if (this.creep.pos.x === 49) {
				updateStatus = this.creep.move(LEFT);
			} else if (this.creep.pos.y === 0) {
				updateStatus = this.creep.move(BOTTOM);
			} else if (this.creep.pos.y === 49) {
				updateStatus = this.creep.move(TOP);
			}

			// Update the room status immediately when entering the room
			if (updateStatus === OK) {
				this.scoutManager.updateRoomStatus(this.creep.room.name);
			}
		}
	}
}

module.exports = ScoutCreepManager;
