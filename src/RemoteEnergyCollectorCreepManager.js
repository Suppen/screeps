"use strict";

const ResourceHandlingCreepManager = require("ResourceHandlingCreepManager");

const utils = require("utils");

/**
 * Manager for a creep type which goes around and collects dropped energy and moves energy from containers to other things
 */
class RemoteEnergyCollectorCreepManager extends ResourceHandlingCreepManager {
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
		} else if (this.loadLevel === 1 && this.isSwooping) {
			this.isSwooping = false;
			this.resourceDropoff = null;
		}

		if (this.isSwooping) {
			// Go to the container
			if (this.aquireResource() !== OK) {
				this.creep.moveTo(this.resourcePickup);
			}
		} else if (!this.isInParentRoom) {
			this.creep.moveTo(new RoomPosition(25, 25, this.parentRoomName));
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
		} else if (energy >= 300) {
			body = [MOVE, CARRY, CARRY];
		}
		return body;
	}
}

module.exports = RemoteEnergyCollectorCreepManager;
