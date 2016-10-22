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

		// Check if there are any containers or links or storage
		if ((pickups.containers.length > 0 || pickups.links.length > 0) && pickup === null) {
			// Combine links and containers
			let linksContainers = pickups.containers.concat(pickups.links);

			// Put the storage in the array too, if allowed
			if (this.repairManager.useStoredEnergy && pickups.storage !== null) {
				linksContainers.push(pickups.storage);
			}

			// Ignore containers with less than 50 energy
			linksContainers = linksContainers.filter(s => {
				let keep = false;
				if (s instanceof StructureLink) {
					keep = s.energy > 50
				} else {
					keep = s.store.energy > 50;
				}
				return keep;
			});

			// Choose the closest one
			pickup = this.creep.pos.findClosestByRange(linksContainers);
		}

		// Last resort: Harvest a source, but only if there are no containers
		if (pickup === null && this.energyManager.localContainers.length === 0 && pickups.sources.length > 0) {
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
			this.repairTarget = null;
		}

		if (!this.isRepairing) {
			// Is the creep in the parent room?
			if (this.isInParentRoom) {
				// Check if the source is ok
				if (this.energyManager.pickupIsBad(this.resourcePickup)) {
					this.resourcePickup = this.findPickup();
				}

				// Go get energy
				if (this.aquireResource() === ERR_NOT_IN_RANGE) {
					this.creep.moveTo(this.resourcePickup);
				}
			} else {
				// Nope. Go there
				this.creep.moveTo(new RoomPosition(25, 25, this.parentRoomName));
			}
		} else {
			// Check if the creep has been assigned a repair site
			if (this.repairTarget === null || this.counter >= 10 || this.repairTarget.hits === this.repairTarget.hitsMax) {
				let repairTargetId = this.repairManager.getRepairTargetId();
				this.repairTarget = Game.getObjectById(repairTargetId);
				this.counter = 0;
			}
			// Go repair the structure. Treat containers specially
			let status = this.creep.repair(this.repairTarget);
			switch (status) {
				case OK:
					// Treat containers specially. Repair them until the container is completely fixed or until the creep has no energy left
					if (!(this.repairTarget instanceof StructureContainer)) {
						this.counter++;
					}
					break;
				case ERR_NOT_IN_RANGE:
					this.creep.moveTo(this.repairTarget);
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

		if (energy >= 1400) {
			body = {WORK: 7, MOVE: 7, CARRY: 7};
		} else if (energy >= 1000) {
			body = {WORK: 5, MOVE: 5, CARRY: 5};
		} else if (energy >= 600) {
			body = {WORK: 3, MOVE: 3, CARRY: 3};
		} else if (energy >= 400) {
			body = {WORK: 2, MOVE: 2, CARRY: 2};
		} else {
			body = {WORK: 1, MOVE: 1, CARRY: 2};
		}
		return body;
	}
}

module.exports = RepairerCreepManager;
