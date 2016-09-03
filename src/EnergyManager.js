"use strict";

const WorkforceManager = require("WorkforceManager");
const LinkManager = require("LinkManager");
const ScoutManager = require("ScoutManager");

const EnergyCollectorCreepManager = require("EnergyCollectorCreepManager");
const EnergyHarvesterCreepManager = require("EnergyHarvesterCreepManager");

const defaultConfig = {
	useStoredEnergy: false,
	wantedCreeps: {}
};

/**
 * Manages sources and containers and makes sure spawns, extensions and the like are filled
 */
class EnergyManager extends WorkforceManager {
	/**
	 * Creates a new energy manager
	 *
	 * @param {RoomManager} roomManager	The room manager which owns this energy manager. Must have a spawn manager on it!
	 * @param {Object} config	Configuration for the energy manager
	 */
	constructor(roomManager, config) {
		super(roomManager.spawnManager);

		/**
		 * The room manager for this energy manager
		 */
		this.roomManager = roomManager;

		/**
		 * The config for this energy manager
		 */
		this.config = _.defaults(config, defaultConfig);

		// Create a link manager
		this.linkManager = new LinkManager(this);
	}

	/**
	 * The memory for this source manager
	 */
	get memory() {
		if (this.roomManager.memory.energyManager === undefined) {
			this.roomManager.memory.energyManager = {};
		}
		return this.roomManager.memory.energyManager;
	}

	/**
	 * The name of this workforce
	 */
	get workforceName() {
		return this.roomManager.roomName + ".energyManager";
	}

	/**
	 * Map of creeps wanted for this manager, with role names as the key
	 */
	get wantedCreeps() {
		let wantedCreeps = this.config.wantedCreeps;

		// Calculate bodies of energy collectors, if not specified
		if (wantedCreeps.energyCollector !== undefined && wantedCreeps.energyCollector.body === undefined) {
			wantedCreeps.energyCollector.body = EnergyCollectorCreepManager.calculateBody(this.roomManager.room.energyCapacityAvailable);
		}

		return wantedCreeps;
	}

	/**
	 * Whether or not energy in the storage can be used
	 */
	get useStoredEnergy() {
		return this.config.useStoredEnergy;
	}

	/**
	 * Map between source and harvester creep
	 */
	get _sourceHarvesterMap() {
		if (this.memory.sourceHarvesterMap === undefined) {
			this.memory.sourceHarvesterMap = {};
		}
		return this.memory.sourceHarvesterMap;
	}

	/**
	 * The sources managed by this manager
	 */
	get sources() {
		if (this._sources === undefined) {
			this._sources = this.roomManager.find(FIND_SOURCES, {roomStatuses: []});
		}
		return this._sources;
	}

	/**
	 * List of all containers within two tiles of a source
	 *
	 * @return {StructureContainer[]}	An array of all containers within two tiles of a source
	 */
	get containers() {
		if (this._containers === undefined) {
			this._containers = this.roomManager.find(FIND_STRUCTURES, {
				roomStatuses: [],
				filter: (s) => {
					return (
						s instanceof StructureContainer &&
						this.sources.reduce((withinTwoTiles, source) => withinTwoTiles || source.pos.getRangeTo(s) <= 2, false)
					);
				}
			});
		}
		return this._containers;
	}

	/**
	 * The storage in the room
	 */
	get storage() {
		return this.roomManager.room.storage;
	}

	/**
	 * All loose energy lying around
	 */
	get looseEnergy() {
		if (this._looseEnergy === undefined) {
			this._looseEnergy = this.roomManager.find(FIND_DROPPED_ENERGY, {
				roomStatuses: []
			});
		}
		return this._looseEnergy;
	}

	/**
	 * All extensions in the room
	 */
	get extensions() {
		if (this._extensions === undefined) {
			this._extensions = this.roomManager.room.find(FIND_STRUCTURES, {
				filter(s) {
					return s instanceof StructureExtension;
				}
			});
		}
		return this._extensions;
	}

	/**
	 * All spawns in the room
	 */
	get spawns() {
		return this.spawnManager.spawns;
	}

	/**
	 * The terminal
	 */
	get terminal() {
		return this.roomManager.room.terminal;
	}

	/**
	 * All towers
	 */
	get towers() {
		return this.roomManager.towerManager.towers;
	}

	/**
	 * All labs
	 */
	get labs() {
		return this.roomManager.room.find(FIND_STRUCTURES, {
			filter(s) {
				return s instanceof StructureLab;
			}
		});
//		return this.roomManager.labManager.labs;
	}

	/**
	 * Everything which can somehow be used to aquire energy. Does not give empty structures or sources
	 */
	get allPickups() {
		return {
			links: this.linkManager.pickupLinks.concat(this.linkManager.pickupDropoffLinks).filter(EnergyManager.pickupIsGood),
			sources: this.sources.filter(EnergyManager.pickupIsGood),
			storage: EnergyManager.pickupIsGood(this.storage) ? this.storage : null,
			terminal: EnergyManager.pickupIsGood(this.terminal) ? this.terminal : null,
			looseEnergy: this.looseEnergy,
			containers: this.containers.filter(EnergyManager.pickupIsGood)
		};
	}

	/**
	 * Checks whether or not a pickup is bad (empty or non-existent)
	 *
	 * @param {Object} pickup	Anything which can somehow be used to aquire energy
	 *
	 * @return {Boolean}	True if the pickup is bad, false otherwise
	 */
	static pickupIsBad(pickup) {
		return (
			// The pickup doesn't exist
			pickup === undefined ||
			pickup === null ||
			(
				// Storage, containers and the like are empty
				pickup.store !== undefined &&
				pickup.storeCapacity !== undefined &&
				_.sum(pickup.store) === 0
			) ||
			(
				// Spawns, extensions and the like are empty
				pickup.energy !== undefined &&
				pickup.energyCapacity !== undefined &&
				pickup.energy === 0
			) ||
			(
				// Source is empty
				pickup instanceof Source &&
				pickup.energy === 0
			)
		);
	}
	pickupIsBad(pickup) {
		return EnergyManager.pickupIsBad(pickup);
	}

	/**
	 * Checks whether or not a pickup is good (exists and not empty)
	 *
	 * @param {Object} pickup	Anything which can somehow be used to aquire energy
	 *
	 * @return {Boolean}	True if the pickup is good, false otherwise
	 */
	static pickupIsGood(pickup) {
		return !EnergyManager.pickupIsBad(pickup);
	}
	pickupIsGood(pickup) {
		return EnergyManager.pickupIsGood(pickup);
	}


	/**
	 * Everything which can somehow be used to drop off energy
	 */
	get allDropoffs() {
		return {
			links: this.linkManager.dropoffLinks.concat(this.linkManager.pickupDropoffLinks).filter(EnergyManager.dropoffIsGood),
			storage: EnergyManager.dropoffIsGood(this.storage) ? this.storage : null,
			terminal: EnergyManager.dropoffIsGood(this.terminal) ? this.terminal : null,
			containers: this.containers.filter(EnergyManager.dropoffIsGood),
			extensions: this.extensions.filter(EnergyManager.dropoffIsGood),
			spawns: this.spawns.filter(EnergyManager.dropoffIsGood),
			towers: this.towers.filter(EnergyManager.dropoffIsGood).filter(t => t.energy <= 800),
			labs: this.labs.filter(EnergyManager.dropoffIsGood)
		}
	}

	/**
	 * Checks whether or not a dropoff is bad (full or non-existent)
	 *
	 * @param {Structure} dropoff	Anything which can somehow be used to dump energy
	 *
	 * @return {Boolean}	True if the dropoff is bad, false otherwise
	 */
	static dropoffIsBad(dropoff) {
		return (
			// The dropoff doesn't exist (or isn't visible)
			dropoff === undefined ||
			dropoff === null ||
			// The dropoff is full
			(
				// Spawns, extensions and the like are full
				dropoff.energy !== undefined &&
				dropoff.energyCapacity !== undefined &&
				dropoff.energy == dropoff.energyCapacity
			) ||
			(
				// Storage, containers and the like are full
				dropoff.store !== undefined &&
				dropoff.storeCapacity !== undefined &&
				_.sum(dropoff.store) == dropoff.storeCapacity
			)
		);
	}
	dropoffIsBad(dropoff) {
		return EnergyManager.dropoffIsBad(dropoff);
	}

	/**
	 * Checks whether or not a dropoff is good (exists and is not full)
	 *
	 * @param {Structure} dropoff	Anything which can somehow be used to dump energy
	 *
	 * @return {Boolean}	True if the dropoff is good, false otherwise
	 */
	static dropoffIsGood(dropoff) {
		return !EnergyManager.dropoffIsBad(dropoff);
	}
	dropoffIsGood(dropoff) {
		return EnergyManager.dropoffIsGood(dropoff);
	}

	/**
	 * Checks health of containers
	 *
	 * @private
	 */
	_checkContainerHealth() {
		// Schedule containers for repair
		this.containers.forEach(c => {
			if (c.hits / c.hitsMax < 0.5) {
				this.roomManager.repairManager.addToRepairQueue(c);
			}
		});
	}

	/**
	 * Assigns harvesters to sources
	 *
	 * @private
	 */
	_assignHarvestersToSources() {
		// Remove mappings where the creep is no longer part of the workforce
		for (let sourceId in this._sourceHarvesterMap) {
			let creep = Game.creeps[this._sourceHarvesterMap[sourceId]];
			if (creep === undefined) {
				delete this._sourceHarvesterMap[sourceId];
			}
		}

		// Find all harvesters which do not have an assigned source
		let unassignedHarvesters = this.creepManagers.filter(cm => cm instanceof EnergyHarvesterCreepManager && cm.resourcePickup === null);

		// Find all sources without assigned harvesters
		let sourcesWithoutHarvesters = this.sources.filter(s => this._sourceHarvesterMap[s.id] === undefined);

		// Assign harvesters to sources
		while (unassignedHarvesters.length > 0 && sourcesWithoutHarvesters.length > 0) {
			let source = sourcesWithoutHarvesters.pop();
			let harvester = unassignedHarvesters.pop();

			this._sourceHarvesterMap[source.id] = harvester.creepName;
			harvester.resourcePickup = source;
		}
	}

	run() {
		super.run();

		// Check if containers are healthy
		if (Game.time % EnergyManager.containerHealthCheckInterval === 0) {
			this._checkContainerHealth();
		}

		// Check if all sources have an assigned harvester
		this._assignHarvestersToSources();

		// Run the link manager
		this.linkManager.run();
	}

	/**
	 * Time interval for checking containers next to sources
	 */
	static get containerHealthCheckInterval() {
		return 7;	// Prime
	}
}

module.exports = EnergyManager;
