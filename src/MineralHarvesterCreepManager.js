"use strict";

const ResourceHandlingCreepManager = require("ResourceHandlingCreepManager");

/**
 * Creep type which harvests minerals and brings them to labs and the terminal
 */
class MineralHarvesterCreepManager extends ResourceHandlingCreepManager {
	/**
	 * Creates a new Mineral harvester manager
	 *
	 * @param {String} creepName	Name of the creep to manage
	 * @param {MineralManager} mineralManager	The mineral manager this creep is managed by
	 */
	constructor(creepName, mineralManager) {
		super(creepName, mineralManager);

		// Store a reference to the mineral manager
		this.mineralManager = mineralManager;

		// Set the creep's resource type to whatever type is in the room
		this.resourceType = this.mineralManager.mineralInRoom.mineralType;

		// Set the creep's pickup to the mineral source in the room
		this.resourcePickup = this.mineralManager.mineralInRoom;
	}

	/**
	 * Boolean telling if the creep is currently harvesting or dropping off
	 */
	get isHarvesting() {
		if (this.memory.isHarvesting === undefined) {
			this.memory.isHarvesting = true;
		}
		return this.memory.isHarvesting;
	}
	set isHarvesting(isHarvesting) {
		this.memory.isHarvesting = isHarvesting;
	}

	/**
	 * Finds a place to drop off the mineral
	 */
	findDropoff() {
		// Find all possible dropoffs
		let dropoffs = this.mineralManager.allDropoffs(this.resourceType);

		// The selected dropoff
		let dropoff = null;

		// Is the terminal ready for this mineral?
		if (dropoff === null && dropoffs.terminal !== null) {
			dropoff = dropoffs.terminal;
		}

		// Any labs wanting this mineral?
		// TODO

		return dropoff;
	}

	
	run() {
		// Set correct harvesting state
		if (this.loadLevel === 1 && this.isHarvesting) {
			// Stop harvesting and find a dropoff for the energy
			this.isHarvesting = false;
			this.resourceDropoff = this.findDropoff();
		} else if (this.loadLevel === 0 && !this.isHarvesting) {
			// Start harvesting and find a source
			this.isHarvesting = true;
		}

		if (this.isHarvesting) {
			// Go harvest the source
			if (this.aquireResource() === ERR_NOT_IN_RANGE) {
				this.creep.moveTo(this.resourcePickup);
			}
		} else {
			// Check if a new dropoff is needed
			if (this.mineralManager.dropoffIsBad(this.resourceDropoff, this.resourceType)) {
				this.resourceDropoff = this.findDropoff();
			}

			// Calculate amount to drop off
			let amount = undefined;	// Drop off whatever amount the creep is carrying
			if (this.resourceDropoff instanceof StructureTerminal) {
				amount = Math.min(this.mineralManager.roomManager.terminalManager.maximumOfEachResource - this.resourceDropoff.store[this.resourceType], amount);
			}

			// Go dump the mineral somewhere
			let status = this.dropoffResource();
			switch (status) {
				case ERR_NOT_IN_RANGE:
					this.creep.moveTo(this.resourceDropoff);
					break;
				case ERR_FULL:
					this.resourceDropoff = this.findDropoff();
					break;
				case ERR_NOT_ENOUGH_RESOURCES:
					this.isHarvesting = false;
					break;
				default:
					break;
			}
		}
	}

	/**
	 * Calculates a default body for the creep based on an amount of energy
	 */
	static calculateBody(energy) {
		return {WORK: 10, MOVE: 10, CARRY: 10};
	}
}

module.exports = MineralHarvesterCreepManager;
