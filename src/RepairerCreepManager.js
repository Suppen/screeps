"use strict";

const ResourceHandlingCreepManager = require("ResourceHandlingCreepManager");

const utils = require("utils");

/**
 * A creep which repairs structures in need of repair
 */
class RepairerCreepManager extends ResourceHandlingCreepManager {
	/**
	 * Creates a new manager for a repairer creep
	 *
	 * @param {String} creepName	The name of the creep to manage
	 * @param {RepairManager}	The repair manager managing this manager
	 */
	constructor(creepName, repairManager) {
		super(creepName, repairManager);

		/**
		 * The repair manager managing this manager
		 */
		this.repairManager = repairManager;

		/**
		 * The energy manager to ask for instructions from
		 */
		this.energyManager = this.repairManager.roomManager.energyManager;

		// Set the creep's resource type to energy
		this.resourceType = RESOURCE_ENERGY;
	}

	/**
	 * Boolean telling if the creep is currently repairing or gathering more energy
	 */
	get isRepairing() {
		if (this.memory.isRepairing === undefined) {
			this.memory.isRepairing = true;
		}
		return this.memory.isRepairing;
	}
	set isRepairing(isRepairing) {
		this.memory.isRepairing = isRepairing;
	}

	/**
	 * The structure this creep should repair, or null
	 */
	get repairTarget() {
		if (this.memory.repairTargetId === undefined) {
			this.memory.repairTargetId = null;
		}
		return Game.getObjectById(this.memory.repairTargetId);
	}
	set repairTarget(repairTarget) {
		let id = null;
		if (repairTarget !== null) {
			id = repairTarget.id;
		}
		this.memory.repairTargetId = id;
	}

	/**
	 * Counter for how many times the current structure has been repaired
	 */
	get counter() {
		if (this.memory.repairCounter === undefined) {
			this.memory.repairCounter = 0;
		}
		return this.memory.repairCounter;
	}
	set counter(count) {
		this.memory.repairCounter = count;
	}

	/**
	 * Finds a good energy pickup
	 *
	 * @return {Structure}	A structure which can somwhow be used to get energy
	 */
	findPickup() {
		let pickups = this.energyManager.allPickups;

		// The selected pickup
		let pickup = null;

		// Check if there are any containers or links
		if ((pickups.containers.length > 0 || pickups.links.length > 0) && pickup === null) {
			pickup = utils.findClosest(this.creep.pos, pickups.containers.concat(pickups.links));
		}

		// Check the storage
		if (pickups.storage !== null && pickup === null) {
			pickup = pickups.storage;
		}

		// Last resort: Harvest a source
		if (pickups.sources.length > 0 && pickup === null) {
			pickup = utils.findClosest(this.creep.pos, pickups.sources);
		}

		return pickup;
	}

	run() {
		// Set correct state
		if (this.loadLevel === 1 && !this.isRepairing) {
			// Stop harvesting and find a structure to repair
			this.isRepairing = true;
		} else if (this.loadLevel === 0 && this.isRepairing) {
			// Start harvesting and find a source
			this.isRepairing = false;
			this.resourcePickup = null;
		}

		if (!this.isRepairing) {
			// Check if the source is ok
			if (this.energyManager.pickupIsBad(this.resourcePickup)) {
				this.resourcePickup = this.findPickup();
			}

			// Go get energy
			if (this.aquireResource() === ERR_NOT_IN_RANGE) {
				this.creep.moveTo(this.resourcePickup);
			}
		} else {
			// Check if the creep has been assigned a repair site
			if (this.repairTarget === null || this.counter >= 10 || this.repairTarget.hits === this.repairTarget.hitsMax) {
				this.repairTarget = Game.getObjectById(this.repairManager.getRepairTargetId());
				this.counter = 0;
			}
			// Go repair the structure
			let status = this.creep.repair(this.repairTarget);
			switch (status) {
				case OK:
					this.counter++;
					break;
				case ERR_NOT_IN_RANGE:
					this.creep.moveTo(this.repairTarget);
					break;
				default:
					break;
			}
		}
	}
}

module.exports = RepairerCreepManager;
