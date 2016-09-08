"use strict";

const ResourceHandlingCreepManager = require("ResourceHandlingCreepManager");

const utils = require("utils");

/**
 * Manager for a creep which upgrades a room controller
 */
class UpgraderCreepManager extends ResourceHandlingCreepManager {
	/**
	 * Creates a new upgrader creep manager
	 *
	 * @param {String} creepName	Name of the creep to manage
	 * @param {WorkforceManager} workforceManager	The workforce manager in charge of this upgrader
	 */
	constructor(creepName, workforceManager) {
		super(creepName);

		/**
		 * The workforce manager in charge of this upgrader
		 */
		this.workforceManager = workforceManager;

		/**
		 * The energy manager to ask for instructions from
		 */
		this.energyManager = this.workforceManager.roomManager.energyManager;

		// Set the creep's resource type to energy
		this.resourceType = RESOURCE_ENERGY;
	}

	/**
	 * Boolean telling if the creep is currently upgrading the controller or gathering more energy
	 */
	get isUpgrading() {
		if (this.memory.isUpgrading === undefined) {
			this.memory.isUpgrading = true;
		}
		return this.memory.isUpgrading;
	}
	set isUpgrading(isUpgrading) {
		this.memory.isUpgrading = !!isUpgrading;
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
			// Combine links and containers
			let linksContainers = pickups.containers.concat(pickups.links);

			// Ignore containers with less than 50 energy
			linksContainers = linksContainers.filter(s => {
				let keep = false;
				if (s instanceof StructureLink) {
					keep = s.energy > 50
				} else {
					keep = s.store.energy > 50;
				}
				return keep;
			});

			// Put the storage on
			if (pickups.storage !== null) {
				linksContainers.push(pickups.storage);
			}

			// Choose the closest one
			pickup = utils.findClosest(this.creep.pos, linksContainers);
		}

		// Last resort: Harvest a source, but only if there are no containers
		if (this.energyManager.localContainers.length === 0 && pickups.sources.length > 0 && pickup === null) {
			pickup = utils.findClosest(this.creep.pos, pickups.sources);
		}

		return pickup;
	}

	run() {
		// Set correct state
		if (this.loadLevel === 1 && !this.isUpgrading) {
			// Stop harvesting and go upgrade the controller
			this.isUpgrading = true;
			this.resourcePickup = null;
		} else if (this.loadLevel === 0 && this.isUpgrading) {
			// Start harvesting and find a source
			this.isUpgrading = false;
		}

		if (!this.isUpgrading) {
			// Check if the source is ok
			if (this.energyManager.pickupIsBad(this.resourcePickup)) {
				this.resourcePickup = this.findPickup();
			}

			// Go get energy
			if (this.aquireResource() === ERR_NOT_IN_RANGE) {
				this.creep.moveTo(this.resourcePickup);
			}
		} else {
			let result = this.creep.upgradeController(this.workforceManager.roomManager.room.controller);
			switch (result) {
				case ERR_NOT_IN_RANGE:
					this.creep.moveTo(this.workforceManager.roomManager.room.controller);
					break;
				default:
					break;
			}
		}
	}
}

module.exports = UpgraderCreepManager;
