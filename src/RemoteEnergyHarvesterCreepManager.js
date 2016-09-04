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
		// Go harvest the source
		if (this.aquireResource() !== OK) {
			this.creep.moveTo(this.resourcePickup);
		}
	}
}

module.exports = RemoteEnergyHarvesterCreepManager;
