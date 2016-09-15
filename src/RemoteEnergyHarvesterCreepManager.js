"use strict";

const ResourceHandlingCreepManager = require("ResourceHandlingCreepManager");

/**
 * A creep which harvests remote energy sources
 */
class RemoteEnergyHarvesterCreepManager extends ResourceHandlingCreepManager {
	/**
	 * Creates a new Energy harvester manager
	 *
	 * @param {String} creepName	Name of the creep to manage
	 * @param {EnergyManager} energyManager	The energy manager this creep is managed by
	 */
	constructor(creepName, energyManager) {
		super(creepName, energyManager);

		// Store a reference to the energy manager
		this.energyManager = energyManager;

		// Set the creep's resource type to energy
		this.resourceType = RESOURCE_ENERGY;
	}

	run() {
		if (this.resourcePickup === null) {
			return;
		}

		let standingOnContainer = true;
		if (this.creep.room === this.resourcePickup.room) {
			standingOnContainer = this.creep.room.lookForAt(LOOK_STRUCTURES, this.creep.pos).find(s => s instanceof StructureContainer) !== undefined;
		}

		// Go harvest the source
		if (!standingOnContainer || this.aquireResource() !== OK) {
			let whereToGo = this.resourcePickup;

			if (this.creep.room === this.resourcePickup.room) {
				// Find the container
				let s = this.resourcePickup;
				let containers = s.room.lookForAtArea(LOOK_STRUCTURES, s.pos.y-1, s.pos.x-1, s.pos.y+1, s.pos.x+1, true).filter(s => s.structure instanceof StructureContainer);
				if (containers.length > 0) {
					whereToGo = containers[0].structure;
				} else {
					// The container has been destroyed! Just die
					this.creep.suicide();
				}
			}

			this.creep.moveTo(whereToGo);
		}
	}

	/**
	 * Calculates a default body for the creep based on an amount of energy
	 */
	static calculateBody(energy) {
		return [MOVE, MOVE, MOVE, WORK, WORK, WORK, WORK, WORK];
	}
}

module.exports = RemoteEnergyHarvesterCreepManager;
