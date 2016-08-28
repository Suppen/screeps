"use strict";

const ResourceHandlingCreepManager = require("ResourceHandlingCreepManager");

const utils = require("utils");

/**
 * A creep which harvests energy sources
 */
class EnergyHarvesterCreepManager extends ResourceHandlingCreepManager {
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
	 * Finds a dropoff to dump energy on
	 *
	 * @return {Structure}	The found dropoff, or null if there are no valid dropoffs
	 */
	findDropoff() {
		// Go to parent room if not there
		if (this.creep.room.name !== this.energyManager.roomManager.roomName) {
			this.creep.moveTo(new RoomPosition(25, 25, this.energyManager.roomManager.roomName));
			return null;
		}

		// Find all possible dropoffs
		let dropoffs = this.energyManager.allDropoffs;

		// The selected dropoff
		let dropoff = null;

		// First, check for nearby links
		if (dropoffs.links.length > 0) {
			let link = utils.findClosest(this.creep.pos, dropoffs.links);

			// Only go for nearby links, within 2 tiles
			if (link.distance <= 2) {
				dropoff = link;
			}
		}

		// If no suitable link was found, find a container
		if (dropoff === null && dropoffs.containers.length > 0) {
			let container = utils.findClosest(this.creep.pos, dropoffs.containers);

			// Only go for nearby containers, within 2 tiles
			if (container.distance <= 2) {
				dropoff = container;
			}
		}

		// Then, go for extensions and spawns
		if (dropoff === null && (dropoffs.extensions.length > 0 || dropoffs.spawns.length > 0)) {
			// Find the closest one
			dropoff = utils.findClosest(this.creep.pos, dropoffs.extensions.concat(dropoffs.spawns));
		}

		// Still none? Check for towers
		if (dropoff === null && dropoffs.towers.length > 0) {	
			dropoff = utils.findClosest(this.creep.pos, dropoffs.towers);
		}

		// All towers full, too? Check for labs
		if (dropoff === null && dropoffs.labs.length > 0) {
			dropoff = utils.findClosest(this.creep.pos, dropoffs.labs);
		}

		// Last chance! The storage!
		if (dropoff === null && dropoffs.storage !== null) {
			dropoff = dropoffs.storage;
		}

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
			if (this.energyManager.dropoffIsBad(this.resourceDropoff)) {
				this.resourceDropoff = this.findDropoff();
			}

			// Go dump the energy somewhere
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
}

module.exports = EnergyHarvesterCreepManager;
