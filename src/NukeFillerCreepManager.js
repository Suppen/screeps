"use strict";

const ResourceHandlingCreepManager = require("ResourceHandlingCreepManager");

/**
 * Creep type which takes ghodium from terminals and puts in nukers
 */
class NukeFillerCreepManager extends ResourceHandlingCreepManager {
	/**
	 * Creates a new nuke filler creep manager
	 *
	 * @param {String} creepName	Name of the creep to manage
	 * @param {WorkforceManager} workforceManager	Whatever workforce manager is managing this creep
	 */
	constructor(creepName, workforceManager) {
		super(creepName, workforceManager);

		// Set the creep's resource type to ghodium
		this.resourceType = RESOURCE_GHODIUM;

		// Set the creep's pickup to the terminal in the room
		this.resourcePickup = workforceManager.roomManager.terminalManager.terminal;

		// Set the creep's dropoff to the nuker
		this.resourceDropoff = workforceManager.roomManager.room.find(FIND_MY_STRUCTURES).filter(s => s instanceof StructureNuker)[0];
	}

	/**
	 * Boolean telling if the creep is currently hauling ghodium from the terminal to the nuker or collecting more ghodium from the terminal
	 */
	get isHauling() {
		if (this.memory.isHauling === undefined) {
			this.memory.isHauling = true;
		}
		return this.memory.isHauling;
	}
	set isHauling(isHauling) {
		this.memory.isHauling = isHauling;
	}

	/**
	 * The amount of ghodium the creep has dropped off
	 */
	get droppedOff() {
		if (this.memory.droppedOff === undefined) {
			this.memory.droppedOff = 0;
		}
		return this.memory.droppedOff;
	}
	set droppedOff(newAmount) {
		this.memory.droppedOff = newAmount;
	}

	run() {
		// Set correct harvesting state
		if (this.loadLevel === 1 && !this.isHauling) {
			// Start hauling the ghodium to the nuker
			this.isHauling = true;
		} else if (this.loadLevel === 0 && this.isHauling) {
			// Go get more from the terminal
			this.isHauling = false;
		}

		if (this.isHauling) {
			// Go dump the ghodium in the nuker
			if (this.dropoffResource() !== OK) {
				this.creep.moveTo(this.resourceDropoff);
			}
		} else {
			// Go get more ghodium from the terminal
			if (this.aquireResource() !== OK) {
				this.creep.moveTo(this.resourcePickup);
			} else {
				this.droppedOff += this.creep.carry[RESOURCE_GHODIUM];
			}
		}
	}
}

module.exports = NukeFillerCreepManager;
