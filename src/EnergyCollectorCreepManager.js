"use strict";

const ResourceHandlingCreepManager = require("ResourceHandlingCreepManager");

const utils = require("utils");

/**
 * Manager for a creep type which goes around and collects dropped energy and moves energy from containers to other things
 */
class EnergyCollectorCreepManager extends ResourceHandlingCreepManager {
	/**
	 * Creates a new Energy collector manager
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
	 * Boolean telling if the creep is currently upgrading the controller or gathering more energy
	 */
	get isSwooping() {
		if (this.memory.isSwooping === undefined) {
			this.memory.isSwooping = true;
		}
		return this.memory.isSwooping;
	}
	set isSwooping(isSwooping) {
		this.memory.isSwooping = isSwooping;
	}

	/**
	 * Finds a pickup to get energy from
	 */
	findPickup() {
		// Find all possible pickups
		let pickups = this.energyManager.allPickups;

		// The selected pickup
		let pickup = null;

		// If permitted, take from the storage first
		if (this.useStoredEnergy && pickups.storage !== null) {
			pickup = pickups.storage;
		}

		// Check for loose energy
		if (pickup === null) {
			let looseEnergy = pickups.looseEnergy.filter(e => e.energy > 25);
			if (looseEnergy.length > 0) {
				// TODO Filter out puddles by size and range
				pickup = utils.findClosest(this.creep.pos, looseEnergy);
			}
		}

		// Then, Go for containers and links
		if ((pickups.containers.length > 0 || pickups.links.length > 0) && pickup === null) {
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

			pickup = utils.findClosest(this.creep.pos, linksContainers);
		}

		// Last chance! The storage!
		if (pickup === null && pickups.storage !== null) {
			pickup = pickups.storage;
		}

		return pickup;
	}

	/**
	 * Finds a dropoff to dump energy on
	 *
	 * @return {Structure}	The found dropoff, or null if there are no valid dropoffs
	 */
	findDropoff() {
		// Find all possible dropoffs
		let dropoffs = this.energyManager.allDropoffs;

		// The selected dropoff
		let dropoff = null;

		// First, check for nearby links
		// Only check links which can only be dropped off to
		dropoffs.links = this.energyManager.linkManager.dropoffLinks.filter(this.energyManager.dropoffIsGood);
		if (dropoffs.links.length > 0) {
			let link = utils.findClosest(this.creep.pos, dropoffs.links);

			// Only go for nearby links, within 2 tiles, and NOT the one which was just picked up from
			if (link.distance <= 2 && link != this.resourcePickup) {
				dropoff = link;
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

		// Other links, then
		// Only check links which can be both picked up from and dropped off to
		dropoffs.links = this.energyManager.linkManager.pickupDropoffLinks.filter(this.energyManager.dropoffIsGood);
		if (dropoff === null && dropoffs.links.length > 0) {
			let link = utils.findClosest(this.creep.pos, dropoffs.links);
			if (link != this.resourcePickup) {
				dropoff = link;
			}
		}

		// Does the terminal have capacity for more energy?
/*
		if (dropoff === null && dropoffs.terminal !== null && dropoffs.terminal.store.energy < TerminalManager.energyBuffer) {
			dropoff = dropoffs.terminal;
		}
*/

		// Last chance! The storage!
		if (dropoff === null && dropoffs.storage !== null) {
			dropoff = dropoffs.storage;
		}

		return dropoff;
	}

	run() {
		if (this.loadLevel === 0 && !this.isSwooping) {
			this.isSwooping = true;
			this.resourcePickup = null;
		} else if (this.loadLevel === 1 && this.isSwooping) {
			this.isSwooping = false;
			this.resourceDropoff = null;
		}

		if (this.isSwooping) {
			// Check if the creep has some place to get energy
			if (this.energyManager.pickupIsBad(this.resourcePickup)) {
				// Nope. Find one
				this.resourcePickup = this.findPickup();
			}
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
				default:
					break;
			}
		}
	}

	/**
	 * Calculates a body for the creep based on an amount of energy
	 */
	static calculateBody(energy) {
		let baseBody = [MOVE, CARRY, CARRY];
		let baseBodyCost = 150;

		let baseBodyCopies = Math.floor(energy / baseBodyCost);
		baseBodyCopies = Math.min(5, baseBodyCopies);

		let body = [];
		for (let i = 0; i < baseBodyCopies; i++) {
			body = body.concat(baseBody);
		}
		return body;
	}
}

module.exports = EnergyCollectorCreepManager;
