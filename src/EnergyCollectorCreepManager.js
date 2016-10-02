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
		if (this.energyManager.useStoredEnergy && pickups.storage !== null) {
			pickup = pickups.storage;
		}

		// Check for loose energy
		if (pickup === null) {
			let looseEnergy = pickups.looseEnergy.filter(e => e.energy > 25);
			if (looseEnergy.length > 0) {
				// TODO Filter out puddles by size and range
				pickup = this.creep.pos.findClosestByRange(looseEnergy);
			}
		}

		// Then, Go for containers and links
		if (pickup === null && (pickups.containers.length > 0 || pickups.links.length > 0)) {
			let linksContainers = pickups.containers.concat(pickups.links);

			// Ignore containers with less than 50 energy
			linksContainers = linksContainers.filter(s => {
				let keep = false;
				if (s instanceof StructureLink) {
					keep = s.energy >= 50;
				} else {
					keep = s.store.energy >= 50;
				}
				return keep;
			});

			pickup = this.creep.pos.findClosestByRange(linksContainers);
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
		return utils.energyCollectorFindDropoff.call(this);
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

			// Calculate amount to drop off
			let amount = undefined;	// Drop off whatever amount the creep is carrying
			if (this.resourceDropoff instanceof StructureTerminal) {
				amount = Math.min(this.energyManager.roomManager.terminalManager.maxEnergy - this.resourceDropoff.store.energy, amount);
			}

			// Go dump the energy somewhere
			let status = this.dropoffResource(amount);
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
	 * Calculates a default body for the creep based on an amount of energy
	 */
	static calculateBody(energy) {
		let body;
		if (energy >= 1200) {
			body = [MOVE, CARRY, CARRY, MOVE, CARRY, CARRY, MOVE, CARRY, CARRY, MOVE, CARRY, CARRY, MOVE, CARRY, CARRY];
		} else if (energy >= 900) {
			body = [MOVE, CARRY, CARRY, MOVE, CARRY, CARRY, MOVE, CARRY, CARRY, MOVE, CARRY, CARRY];
		} else if (energy >= 600) {
			body = [MOVE, CARRY, CARRY, MOVE, CARRY, CARRY, MOVE, CARRY, CARRY];
		} else if (energy >= 400) {
			body = [MOVE, CARRY, CARRY, MOVE, CARRY, CARRY];
		} else {
			body = [MOVE, CARRY, CARRY];
		}
		return body;
	}
}

module.exports = EnergyCollectorCreepManager;
