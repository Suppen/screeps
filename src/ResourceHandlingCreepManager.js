"use strict";

const CreepManager = require("CreepManager");

/**
 * Base class for creeps which can either gather or drop off resources, or both
 */
class ResourceHandlingCreepManager extends CreepManager {
	/**
	 * The place to get resources from
	 */
	get resourcePickup() {
		if (this.memory.resourcePickupId === undefined) {
			this.memory.resourcePickupId = null;
		}
		return Game.getObjectById(this.memory.resourcePickupId);
	}
	set resourcePickup(resourcePickup) {
		let id = null;
		if (resourcePickup !== null) {
			id = resourcePickup.id;
		}
		this.memory.resourcePickupId = id;
	}

	/**
	 * The place to dump the resources
	 */
	get resourceDropoff() {
		if (this.memory.resourceDropoffId === undefined) {
			this.memory.resourceDropoffId = null;
		}
		return Game.getObjectById(this.memory.resourceDropoffId);
	}
	set resourceDropoff(resourceDropoff) {
		let id = null;
		if (resourceDropoff !== null) {
			id = resourceDropoff.id;
		}
		this.memory.resourceDropoffId = id;
	}

	/**
	 * The type of resource currently handled. One of the RESOURCE_* constants, or null
	 */
	get resourceType() {
		if (this.memory.resourceType === undefined) {
			this.memory.resourceType = null;
		}
		return this.memory.resourceType;
	}
	set resourceType(resourceType) {
		this.memory.resourceType = resourceType;
	}

	/**
	 * Load level of the creep, as a number between 0 and 1
	 */
	get loadLevel() {
		return _.sum(this.creep.carry) / this.creep.carryCapacity;
	}

	/**
	 * Makes the creep get resources from the designated source
	 *
	 * @param {Integer} [amount]	Amount of resource to get, if the source is a structure. If not set, the maximum possible amount is transfered
	 *
	 * @return {Integer}	Status code of the attempt to get resources
	 */
	aquireResource(amount) {
		let result = null;

		// Find out what type of source the source is, and do the appropriate thing with it
		let source = this.resourcePickup;
		if (source === null) {
			// No source
			result = ERR_INVALID_TARGET;
		} else if (source instanceof Source) {
			// An energy source. Harvest it
			result = this.creep.harvest(source);
		} else if (source instanceof Mineral) {
			// A mineral. Harvest it
			result = this.creep.harvest(source);
		} else if (source instanceof Resource) {
			// A pool of dropped resources. Pick it up
			result = this.creep.pickup(source);
		} else if (source instanceof Structure) {
			// A structure. Withdraw resources from it
			result = this.creep.withdraw(source, this.resourceType, amount);
		}

		return result;
	}

	/**
	 * Makes the creep go dump its resources to the designated dropoff
	 *
	 * @param {Integer} [amount]	Amount of resource to drop off. If not set, the maximum possible amount is transfered
	 *
	 * @return {Integer}    Status code of the attempt to drop off resources
	 */
	dropoffResource(amount) {
		return this.creep.transfer(this.resourceDropoff, this.resourceType, amount);
	}
}

module.exports = ResourceHandlingCreepManager;
