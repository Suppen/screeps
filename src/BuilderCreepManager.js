"use strict";

const ResourceHandlingCreepManager = require("ResourceHandlingCreepManager");

const utils = require("utils");

/**
 * A creep which constructs buildings on constructions sites
 */
class BuilderCreepManager extends ResourceHandlingCreepManager {
	/**
	 * Creates a new builder creep manager
	 *
	 * @param {String} creepName	Name of the creep to manage
	 * @param {ConstructionManager} constructionManager	The construction manager in charge of this builder
	 */
	constructor(creepName, constructionManager) {
		super(creepName, constructionManager);

		/**
		 * The construction manager which manages this creep
		 */
		this.constructionManager = constructionManager;

		/**
		 * The energy manager to ask for instructions from
		 */
		this.energyManager = this.constructionManager.roomManager.energyManager;

		// Set the creep's resource type to energy
		this.resourceType = RESOURCE_ENERGY;
	}

	/**
	 * Boolean telling if the creep is currently constructing or gathering more energy
	 */
	get isConstructing() {
		if (this.memory.isConstructing === undefined) {
			this.memory.isConstructing = true;
		}
		return this.memory.isConstructing;
	}
	set isConstructing(isConstructing) {
		this.memory.isConstructing = isConstructing;
	}

	/**
	 * The construction site this creep should build, or null
	 */
	get constructionSite() {
		if (this.memory.constructionSiteId === undefined) {
			this.memory.constructionSiteId = null;
		}
		return Game.getObjectById(this.memory.constructionSiteId);
	}
	set constructionSite(constructionSite) {
		let id = null;
		if (constructionSite !== null) {
			id = constructionSite.id;
		}
		this.memory.constructionSiteId = id;
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

			// Choose the closest one
			pickup = utils.findClosest(this.creep.pos, linksContainers);
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
		if (this.loadLevel === 1 && !this.isConstructing) {
			// Stop harvesting and find a site to build
			this.isConstructing = true;
		} else if (this.loadLevel === 0 && this.isConstructing) {
			// Start harvesting and find a source
			this.isConstructing = false;
			this.resourcePickup = null;
		}

		if (!this.isConstructing) {
			// Check if the creep has some place to get energy
			if (this.energyManager.pickupIsBad(this.resourcePickup)) {
				// Nope. Find one
				this.resourcePickup = this.findPickup();
			}
			if (this.aquireResource() === ERR_NOT_IN_RANGE) {
				this.creep.moveTo(this.resourcePickup);
			}
		} else {
			// Check if the creep has been assigned a construction site
			if (this.constructionSite === null) {
				this.constructionSite = this.constructionManager.getConstructionSite();
			}
			// Go construct the site
			if (this.constructionSite !== null) {
				let status = this.creep.build(this.constructionSite);
				switch (status) {
					case ERR_NOT_IN_RANGE:
						this.creep.moveTo(this.constructionSite);
						break;
					default:
						break;
				}
			} else {
				// Nothing to construct. Go to the spawn to get recycled
				let spawns = this.constructionManager.roomManager.spawnManager.spawns;
				if (spawns.length > 0) {
					let spawn = spawns[0];
					if (spawn.recycleCreep(this.creep) === ERR_NOT_IN_RANGE) {
						this.creep.moveTo(spawn);
					}
				} else {
					// There are no spawns managed by this room. Just die here
					this.creep.suicide();
				}
			}
		}
	}
}

module.exports = BuilderCreepManager;
