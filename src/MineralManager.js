"use strict";

const WorkforceManager = require("WorkforceManager");
const MineralHarvesterCreepManager = require("MineralHarvesterCreepManager");

/**
 * Handles the minerals and reactions for a room
 */
class MineralManager extends WorkforceManager {
	/**
	 * Creates a new mineral manager
	 *
	 * @param {RoomManager} roomManager	The room manager which owns this mineral manager. Must have a spawn manager on it!
	 * @param {Object} config	Configuration for the mineral manager
	 */
	constructor(roomManager, config) {
		super(roomManager.spawnManager);

		/**
		 * The room manager for this mineral manager
		 */
		this.roomManager = roomManager;

		/**
		 * The config for this mineral manager
		 */
		this.config = _.defaults(config, {
			labConfig: {},
			wantedCreeps: {}
		});
	}

	/**
	 * The memory of the mineral manager
	 */
	get memory() {
		if (this.roomManager.memory.mineralManager === undefined) {
			this.roomManager.memory.mineralManager = {};
		}
		return this.roomManager.memory.mineralManager;
	}

	/**
	 * The name of this workforce
	 */
	get workforceName() {
		return this.roomManager.roomName + ".mineralManager";
	}

	/**
	 * Map of creeps wanted for this manager, with role names as the key
	 */
	get wantedCreeps() {
		if (this._wantedCreeps === undefined) {
			// Get the config
			this._wantedCreeps = this.config.wantedCreeps;

			// Check if there is a config for mineral harvesters
			if (this._wantedCreeps.mineralHarvester === undefined) {
				this._wantedCreeps.mineralHarvester = {};
			}
			if (this._wantedCreeps.mineralHarvester.amount === undefined) {
				let amount = 0;
				let terminal = this.roomManager.terminalManager.terminal;
				if (terminal && terminal.store[this.mineralInRoom.mineralType] < this.roomManager.terminalManager.maximumOfEachResource && this.mineralInRoom.mineralAmount > 0 && this.extractor !== undefined) {
					amount = 1;
				}

				this._wantedCreeps.mineralHarvester.amount = amount;
			}
			if (this._wantedCreeps.mineralHarvester.body === undefined) {
				this._wantedCreeps.mineralHarvester.body = MineralHarvesterCreepManager.calculateBody(this.roomManager.room.energyCapacityAvailable);
			}
		}

		return this._wantedCreeps;
	}

	/**
	 * The config for the labs
	 */
	get labConfig() {
		return this.config.labConfig;
	}

	/**
	 * The terminal
	 */
	get terminal() {
		return this.roomManager.terminalManager.terminal;
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
	 * Everything which can somehow be used to drop off minerals
	 *
	 * @param {String} resourceType	One of the RESOURCE_* constants
	 */
	allDropoffs(resourceType) {
		return {
			terminal: this.dropoffIsGood(this.terminal, resourceType) ? this.terminal : null,
			labs: this.labs.filter(lab => this.dropoffIsGood(lab, resourceType))
		};
	}

	/**
	 * Checks whether or not a dropoff is bad (full or non-existent)
	 *
	 * @param {Structure} dropoff	Anything which can somehow be used to dump energy
	 *
	 * @return {Boolean}	True if the dropoff is bad, false otherwise
	 */
	dropoffIsBad(dropoff, resourceType) {
		return (
			// The dropoff doesn't exist (or isn't visible)
			dropoff === undefined ||
			dropoff === null ||
			(
				// The terminal is full of this resource
				dropoff instanceof StructureTerminal &&
				dropoff.store[resourceType] >= this.roomManager.terminalManager.maximumOfEachResource
			) ||
			(
				// The lab is full
				dropoff instanceof StructureLab &&
				_.sum(dropoff.store) === dropoff.storeCapacity
			)
		);
	}

	/**
	 * Checks whether or not a dropoff is good (exists and is not full)
	 *
	 * @param {Structure} dropoff	Anything which can somehow be used to dump minerals
	 *
	 * @return {Boolean}	True if the dropoff is good, false otherwise
	 */
	dropoffIsGood(dropoff, resourceType) {
		return !this.dropoffIsBad(dropoff, resourceType);
	}

	/**
	 * The mineral type in the room
	 */
	get mineralInRoom() {
		if (this.memory.mineralInRoom === undefined) {
			let mineralArray = this.roomManager.room.lookForAtArea(LOOK_MINERALS, 0, 0, 49, 49, true);
			this.memory.mineralInRoom = mineralArray[0].mineral.id;
		}
		if (this._mineralInRoom === undefined) {
			this._mineralInRoom = Game.getObjectById(this.memory.mineralInRoom);
		}
		return this._mineralInRoom;
	}

	/**
	 * Gets the extractor in the room. Undefined if there is no extractor
	 */
	get extractor() {
		if (this._extractor === undefined) {
			let structures = this.roomManager.room.lookForAt(LOOK_STRUCTURES, this.mineralInRoom);
			if (structures.length === 1 && structures[0].structureType === STRUCTURE_EXTRACTOR) {
				this._extractor = Game.getObjectById(structures[0].id);
			}
		}

		return this._extractor;
	}

	run() {
		super.run();

		// Do labreactions now and then
		if (Game.time % MineralManager.labCooldown === 0) {

			// Go through the config
			for (let labId in this.labConfig) {

				// Wrap it all in a try/catch to not crash everything
				try {

					// Get the lab
					let lab = Game.getObjectById(labId);

					// Check if this lab is supposed to combine something
					let combines = this.labConfig[labId].combines;
					if (combines !== null) {
						let lab1 = Game.getObjectById(combines[0]);
						let lab2 = Game.getObjectById(combines[1]);

						// Do the reaction
						lab.runReaction(lab1, lab2);
					}
				} catch (e) {
					console.log(e);
				}
			}
		}
	}

	/**
	 * Time between doing reactions with the labs
	 */
	static get labCooldown() {
		return LAB_COOLDOWN;
	}
}

module.exports = MineralManager;
