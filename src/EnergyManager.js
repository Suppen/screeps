"use strict";

const WorkforceManager = require("WorkforceManager");
const LinkManager = require("LinkManager");
const ScoutManager = require("ScoutManager");

const EnergyCollectorCreepManager = require("EnergyCollectorCreepManager");
const RemoteEnergyCollectorCreepManager = require("RemoteEnergyCollectorCreepManager");
const EnergyHarvesterCreepManager = require("EnergyHarvesterCreepManager");
const RemoteEnergyHarvesterCreepManager = require("RemoteEnergyHarvesterCreepManager");

const defaultConfig = {
	useStoredEnergy: false,
	harvestRemoteSources: false,
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

		// Default creeps for remote harvesting if enabled and not specified
		if (this.harvestRemoteSources) {
			if (wantedCreeps.remoteEnergyHarvester === undefined) {
				wantedCreeps.remoteEnergyHarvester = {
					amount() {
						return this.remoteSources.length;
					},
					body: [WORK, WORK, WORK, WORK, WORK, MOVE, MOVE, MOVE]
				};
			}
			if (wantedCreeps.remoteEnergyCollector === undefined) {
				wantedCreeps.remoteEnergyCollector = {
					amount() {
						return this.remoteContainers.length;
					},
					body: [MOVE, CARRY, CARRY, MOVE, CARRY, CARRY, MOVE, CARRY, CARRY, MOVE, CARRY, CARRY, MOVE, CARRY, CARRY, MOVE, CARRY, CARRY, MOVE, CARRY, CARRY]
				};
			}
		}

		// Always have an energy harvester per local source, and with a default body if not specified
		const defaultEnergyHarvester = {
			amount: this.localSources.length,
			body: EnergyHarvesterCreepManager.calculateBody(this.roomManager.room.energyCapacityAvailable),
			priority: 1
		};
		if (wantedCreeps.energyHarvester === undefined) {
			wantedCreeps.energyHarvester = {};
		}
		wantedCreeps.energyHarvester = _.defaults(wantedCreeps.energyHarvester, defaultEnergyHarvester);

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
	 * Whether or not to harvest remote sources
	 */
	get harvestRemoteSources() {
		return this.config.harvestRemoteSources;
	}

	/**
	 * Map between local sources and harvester creeps
	 */
	get _localSourceHarvesterMap() {
		if (this.memory.localSourceHarvesterMap === undefined) {
			this.memory.localSourceHarvesterMap = {};
		}
		return this.memory.localSourceHarvesterMap;
	}
	/**
	 * Map between remote sources and harvester creeps
	 */
	get _remoteSourceHarvesterMap() {
		if (this.memory.remoteSourceHarvesterMap === undefined) {
			this.memory.remoteSourceHarvesterMap = {};
		}
		return this.memory.remoteSourceHarvesterMap;
	}

	/**
	 * Map between remote containers and collector creeps
	 */
	get _remoteContainerCollectorMap() {
		if (this.memory.remoteContainerCollectorMap === undefined) {
			this.memory.remoteContainerCollectorMap = {};
		}
		return this.memory.remoteContainerCollectorMap;
	}

	/**
	 * The sources managed by this manager
	 */
	get sources() {
		if (this._sources === undefined) {
			this._sources = this.roomManager.find(FIND_SOURCES, {
				roomStatuses: [
					ScoutManager.CLAIMABLE,
					ScoutManager.CLAIMED_BY_ME,
					ScoutManager.UNINTERESTING
				]
			});
		}
		return this._sources;
	}

	/**
	 * Sources in the room owning this manager
	 */
	get localSources() {
		if (this._localSources === undefined) {
			this._localSources = this.sources.filter(s => s.room === this.roomManager.room);
		}
		return this._localSources;
	}

	/**
	 * Sources in neighbour rooms
	 */
	get remoteSources() {
		if (this._remoteSources === undefined) {
			this._remoteSources = this.sources.filter(s => s.room !== this.roomManager.room);
			// Only those with a container nearby
			this._remoteSources = this._remoteSources.filter(s => {
				let structures = s.room.lookForAtArea(LOOK_STRUCTURES, s.pos.y-1, s.pos.x-1, s.pos.y+1, s.pos.x+1, true);
				
				return structures.reduce((hasContainer, tile) => {
					return hasContainer || tile.structure.structureType === STRUCTURE_CONTAINER;
				}, false);
			});
		}
		return this._remoteSources;
	}

	/**
	 * List of all containers within two tiles of a source
	 *
	 * @return {StructureContainer[]}	An array of all containers
	 */
	get containers() {
		if (this._containers === undefined) {
			this._containers = this.roomManager.find(FIND_STRUCTURES, {
				roomStatuses: [
					ScoutManager.CLAIMABLE,
					ScoutManager.CLAIMED_BY_ME,
					ScoutManager.UNINTERESTING

				],
				filter: (s) => {
					return s instanceof StructureContainer;
				}
			});
		}
		return this._containers;
	}

	/**
	 * Containers in the room owning this manager
	 */
	get localContainers() {
		if (this._localContainers === undefined) {
			this._localContainers = this.containers.filter(s => s.room === this.roomManager.room);
		}
		return this._localContainers;
	}

	/**
	 * Containers in neighbour rooms
	 */
	get remoteContainers() {
		if (this._remoteContainers === undefined) {
			this._remoteContainers = this.containers.filter(s => s.room !== this.roomManager.room);
		}
		return this._remoteContainers;
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
				roomStatuses: [
					ScoutManager.CLAIMABLE,
					ScoutManager.CLAIMED_BY_ME,
					ScoutManager.UNINTERESTING
				]
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
		return this.roomManager.terminalManager.terminal;
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
	}

	/**
	 * Everything which can somehow be used to aquire energy. Does not give empty structures or sources
	 */
	get allPickups() {
		return {
			links: this.linkManager.pickupLinks.filter(EnergyManager.pickupIsGood),
			sources: this.localSources.filter(EnergyManager.pickupIsGood),
			storage: EnergyManager.pickupIsGood(this.storage) ? this.storage : null,
			terminal: EnergyManager.pickupIsGood(this.terminal) ? this.terminal : null,
			looseEnergy: this.looseEnergy,
			containers: this.localContainers.filter(EnergyManager.pickupIsGood)
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
			links: this.linkManager.dropoffLinks.filter(EnergyManager.dropoffIsGood),
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
				dropoff.energy === dropoff.energyCapacity
			) ||
			(
				// Storage, containers and the like are full
				dropoff.store !== undefined &&
				dropoff.storeCapacity !== undefined &&
				_.sum(dropoff.store) === dropoff.storeCapacity
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
			if (c.hits / c.hitsMax < 0.7) {
				this.roomManager.repairManager.addToRepairQueue(c);
			}
		});
	}

	/**
	 * Assigns harvesters to local sources
	 *
	 * @private
	 */
	_assignHarvestersToLocalSources() {
		// Remove mappings where the creep is no longer part of the workforce
		for (let sourceId in this._localSourceHarvesterMap) {
			let creep = Game.creeps[this._localSourceHarvesterMap[sourceId]];
			if (creep === undefined) {
				delete this._localSourceHarvesterMap[sourceId];
			}
		}

		// Find all harvesters which do not have an assigned source
		let unassignedHarvesters = this.creepManagers.filter(cm => cm instanceof EnergyHarvesterCreepManager && cm.resourcePickup === null);

		// Find all sources without assigned harvesters
		let sourcesWithoutHarvesters = this.localSources.filter(s => this._localSourceHarvesterMap[s.id] === undefined);

		// Assign harvesters to sources
		while (unassignedHarvesters.length > 0 && sourcesWithoutHarvesters.length > 0) {
			let source = sourcesWithoutHarvesters.pop();
			let harvester = unassignedHarvesters.pop();

			this._localSourceHarvesterMap[source.id] = harvester.creepName;
			harvester.resourcePickup = source;
		}
	}

	/**
	 * Assigns harvesters to remote sources
	 *
	 * @private
	 */
	_assignHarvestersToRemoteSources() {
		// Remove mappings where the creep is no longer part of the workforce
		for (let sourceId in this._remoteSourceHarvesterMap) {
			let creep = Game.creeps[this._remoteSourceHarvesterMap[sourceId]];
			if (creep === undefined) {
				delete this._remoteSourceHarvesterMap[sourceId];
			}
		}

		// Find all harvesters which do not have an assigned source
		let unassignedHarvesters = this.creepManagers.filter(cm => cm instanceof RemoteEnergyHarvesterCreepManager && cm.resourcePickup === null);

		// Find all sources without assigned harvesters
		let sourcesWithoutHarvesters = this.remoteSources.filter(s => this._remoteSourceHarvesterMap[s.id] === undefined);

		// Assign harvesters to sources
		while (unassignedHarvesters.length > 0 && sourcesWithoutHarvesters.length > 0) {
			let source = sourcesWithoutHarvesters.pop();
			let harvester = unassignedHarvesters.pop();

			this._remoteSourceHarvesterMap[source.id] = harvester.creepName;
			harvester.resourcePickup = source;
		}
	}

	/**
	 * Assigns collectors to remote containers
	 *
	 * @private
	 */
	_assignCollectorsToRemoteContainers() {
		// Remove mappings where the creep is no longer part of the workforce
		for (let containerId in this._remoteContainerCollectorMap) {
			let creep = Game.creeps[this._remoteContainerCollectorMap[containerId]];
			if (creep === undefined) {
				delete this._remoteContainerCollectorMap[containerId];
			}
		}

		// Find all remote collectors which do not have an assigned container
		let unassignedCollectors = this.creepManagers.filter(cm => cm instanceof RemoteEnergyCollectorCreepManager && cm.resourcePickup === null);

		// Find all containers without assigned collectors
		let containersWithoutCollectors = this.remoteContainers.filter(c => this._remoteContainerCollectorMap[c.id] === undefined);

		// Assign collectors to containers
		while (unassignedCollectors.length > 0 && containersWithoutCollectors.length > 0) {
			let container = containersWithoutCollectors.pop();
			let collector = unassignedCollectors.pop();

			this._remoteContainerCollectorMap[container.id] = collector.creepName;
			collector.resourcePickup = container;
		}
	}

	run() {
		super.run();

		// Check if containers are healthy
		if (Game.time % EnergyManager.containerHealthCheckInterval === 0) {
			this._checkContainerHealth();
		}

		// Assign creeps to stuff
		this._assignHarvestersToLocalSources();
		this._assignHarvestersToRemoteSources();
		this._assignCollectorsToRemoteContainers();

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
