"use strict";

const Manager = require("Manager");

const PriorityQueue = require("PriorityQueue");

/**
 * Handles all spawning
 */
class SpawnManager extends Manager {
	/**
	 * Creates a new spawn manager
	 *
	 * @param {RoomManager} roomManager	The room manager this spawn manager is part of
	 */
	constructor(roomManager) {
		super();

		// Store the room manager
		this.roomManager = roomManager;
	}

	/**
	 * The spawn manager's memory
	 */
	get memory() {
		if (this.roomManager.memory.spawnManager === undefined) {
			this.roomManager.memory.spawnManager = {};
		}
		return this.roomManager.memory.spawnManager;
	}

	/**
	 * The priority queue of creeps waiting to spawn
	 */
	get spawnQueue() {
		// Check if the queue exists
		if (this._spawnQueue === undefined) {
			// Check if the underlying memory exists
			if (this.memory.spawnQueue === undefined) {
				// Create the underlying memory
				this.memory.spawnQueue = [];
			}
			// Create the queue
			this._spawnQueue = new PriorityQueue(this.memory.spawnQueue);
		}
		return this._spawnQueue;
	}

	/**
	 * Gets the spawns managed by this manager
	 */
	get spawns() {
		if (this._spawns === undefined) {
			this._spawns = this.roomManager.room.find(FIND_MY_SPAWNS);
		}
		return this._spawns;
	}

	/**
	 * Checks if a body is valid or not. A valid body has between 1 and 50 (inclusive) bodyparts, all as defined by game constants
	 *
	 * @return {Boolean}	True if the body is valid, false otherwise
	 */
	static bodyIsValid(body) {
		return (
			body instanceof Array &&
			body.length >= 1 &&
			body.length <= 50 &&
			body.reduce((valid, bodypart) => {
				return valid && BODYPARTS_ALL.indexOf(bodypart) >= 0
			}, true)
		);
	}

	/**
	 * Calculates the creep's energy cost
	 *
	 * @param {Bodypart[]} bodyparts	The bodyparts of the creep
	 *
	 * @return {Integer}	Amount of energy needed to spawn this creep
	 */
	static calculateCreepCost(body) {
		return body.reduce((cost, bodypart) => cost + BODYPART_COST[bodypart], 0);
	}

	/**
	 * Adds a creep to the spawn queue
	 *
	 * @param {Object} options	Options for the creep
	 * @param {Bodypart[]} options.body	Array of bodyparts for the creep
	 * @param {String} [options.name]	Name of the creep. If not set, a random name will be given
	 * @param {Object} [options.initialMemory]	Initial memory for the creep. Should be JSON-serializable. Undefined if not set
	 * @param {Spawn} [options.preferredSpawn]	Which spawn this creep should be spawned from. If not set, a random one will be chosen
	 * @param {Integer} [priority]	Spawn priority of this creep. Lower number = higher priority. Defaults to 1000
	 */
	addToSpawnQueue(options, priority = 1000) {
		// Set defaults
		options = _.defaults(options, {
			name: null,
			initialMemory: {},
			preferredSpawn: null
		});

		// Get the name of the preferred spawn
		if (options.preferredSpawn !== null) {
			options.preferredSpawn = options.preferredSpawn.name;
		}

		// Put the creep in the spawn queue
		this.spawnQueue.add(options, priority);
	}

	/**
	 * Spawns creeps from the spawn queue
	 */
	spawnCreeps() {
		// Check if there are any creeps to spawn
		if (this.spawnQueue.size === 0) {
			// Nope. Don't do anything
			return;
		}

		// Get the creep to spawn
		let creepToSpawn = this.spawnQueue.peek();

		// Storage for the spawn array
		let spawns = [];

		// Check if it has a preferred spawn
		if (creepToSpawn.preferredSpawn !== null) {
			// Check if the spawn actually exists
			let spawn = Game.getObjectById(creepToSpawn.preferredSpawn);

			if (spawn === null) {
				// Spawn doesn't exist
				console.log("Spawn " + creepToSpawn.preferredSpawn + " does not exist. Picking random spawn");
				spawns = [];
			} else if (this.roomManager.room.find(FIND_MY_SPAWNS, {filter(s) {return s.name === creepToSpawn.preferredSpawn;}}) !== null) {
				// Spawn is not in this manager's room
				console.log("Spawn " + creepToSpawn.preferredSpawn + " is not in room " + this.roomManager.roomName + ". Picking random spawn");
				spawns = [];
			}
		}

		// Find all spawns if the preferred spawn could not be used
		if (spawns.length === 0) {
			spawns = this.spawns;
		}

		// Give the spawns a "willSpawn" property if they don't have it
		for (let s of spawns) {
			if (s.willSpawn === undefined) {
				s.willSpawn = s.spawning !== null && s.spawning !== undefined;
			}
		}

		// Remove busy spawns
		spawns = spawns.filter(s => !s.willSpawn);

		// Try to spawn the creep
		let spawned = false;
		while (!spawned && spawns.length > 0) {
			// Pick the first available spawn
			let spawn = spawns.shift();

			// Check if it can spawn the creep
			let canCreate = spawn.canCreateCreep(creepToSpawn.body);
			switch (canCreate) {
				case OK:
					// Spawn it!
					let name = spawn.createCreep(creepToSpawn.body, creepToSpawn.name, creepToSpawn.initialMemory);

					// Tell the empire manager there is an unmanaged creep
					this.empireManager.addUnmanagedCreep(name, creepToSpawn.initialMemory.workforce);

					// Mark the spawn as busy
					spawn.willSpawn = true;

					// Tell the loop it can quit
					spawned = true;

					// Remove the creep from the spawn queue
					let creep = this.spawnQueue.shift();

					// Try to spawn more creeps
					this.spawnCreeps();
					break;
				case ERR_NOT_ENOUGH_ENERGY:
					// Check if there is enough energy capacity in the room
					let energyCost = SpawnManager.calculateCreepCost(creepToSpawn.body);
					let energyCapacity = this.roomManager.room.energyCapacityAvailable;
					if (energyCost > energyCapacity) {
						// This creep is too expensive for the room. Remove it from the queue
						console.log("The creep with body [" + creepToSpawn.body.join(", ") + "] costs " + energyCost + " to spawn. Room " + this.roomManager.roomName + " only has a capacity of " + energyCapacity + ". Removing the creep from the spawn queue");
						this.spawnQueue.shift();

						// Try to spawn more creeps
						this.spawnCreeps();
					}
					break;
				default:
					break;
			}
		}
	}

	run() {
		// Do some spawning
		this.spawnCreeps();
	}
}

module.exports = SpawnManager;
