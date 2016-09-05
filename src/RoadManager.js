"use strict";

const Manager = require("Manager");
const ScoutManager = require("ScoutManager");

/**
 * Handles road building for a room
 */
class RoadManager extends Manager {
	constructor(roomManager) {
		super();

		// Store the room manager
		this.roomManager = roomManager
	}

	/**
	 * The memory of the road manager
	 */
	get memory() {
		if (this.roomManager.memory.roadManager === undefined) {
			this.roomManager.memory.roadManager = {};
		}
		return this.roomManager.memory.roadManager;
	}

	/**
	 * The usage map
	 */
	get usageMap() {
		if (this.memory.usageMap === undefined) {
			this.memory.usageMap = {};
		}
		return this.memory.usageMap;
	}

	/**
	 * Gives a usage point to a tile
	 *
	 * @param {String} roomName	Name of the room the tile is in
	 * @param {Integer} x	X coordinate of the tile
	 * @param {Integer} y	Y coordinate of the tile
	 *
	 * @private
	 */
	_useTile(roomName, x, y) {
		if (this.usageMap[roomName] === undefined) {
			this.usageMap[roomName] = {};
		}
		if (this.usageMap[roomName][x] === undefined) {
			this.usageMap[roomName][x] = {};
		}
		if (this.usageMap[roomName][x][y] === undefined) {
			this.usageMap[roomName][x][y] = 0;
		}
		this.usageMap[roomName][x][y]++;
	}

	/**
	 * Build new road and maintain old roads on frequently travelled routes
	 *
	 * @param {String} roomName     Name of the room the tile is in
	 * @param {Integer} x	X coordinate of the tile
	 * @param {Integer} y	Y coordinate of the tile
	 * @param {Integer} usage	Usage of the tile
	 *
	 * @private
	 */
	_manageRoad(roomName, x, y, usage) {
		// Check if there is visibility in the room
		let room = Game.rooms[roomName];

		if (room !== undefined)  {
			// Check if the tile deserves a road
			if (usage >= RoadManager.usageForRoad) {
				// Check if there is a structure or construction site on the tile
				let structure = room.lookAt(x, y).find(s => s.type === LOOK_STRUCTURES || s.type === LOOK_CONSTRUCTION_SITES);

				// Build a road if there is no road on it
				if (structure === undefined || !(structure instanceof StructureRoad)) {
					// Does not have a building on it. Build a road
					room.createConstructionSite(x, y, STRUCTURE_ROAD);
				}

				// Maintain the road if there is already a road on the tile in need of repairs
				if (structure !== undefined && structure.structure instanceof StructureRoad) {
					if (structure.structure.hits / structure.structure.hitsMax < RoadManager.minRoadHealth) {
						this.roomManager.repairManager.addToRepairQueue(structure.structure);
					}
				}
			}
		}
	}

	/**
	 * Reduces tile usage of all tiles
	 *
	 * @private
	 */
	_reduceTileUsage() {
		// Iterate over the usageMap
		for (let roomName in this.usageMap) {
			for (let x in this.usageMap[roomName]) {
				for (let y in this.usageMap[roomName][x]) {
					// Reduce usage
					let newUsage = Math.floor(this.usageMap[roomName][x][y] * RoadManager.mapDecayPercentage);

					// If the new usage is 0, remove it from the usageMap
					if (newUsage === 0) {
						delete this.usageMap[roomName][x][y];

						// If the x coordinate is no longer used, remove it
						if (Object.keys(this.usageMap[roomName][x]).length === 0) {
							delete this.usageMap[roomName][x];

							// If the room is no longer used, remove it
							if (Object.keys(this.usageMap[roomName]).length === 0) {
								delete this.usageMap[roomName];
							}
						}
					} else {
						this.usageMap[roomName][x][y] = newUsage;
					}
				}
			}
		}
	}

	/**
	 * Iterates over the map, and manages roads based on usage
	 *
	 * @private
	 */
	_doMapStuff() {
		for (let roomName in this.usageMap) {
			for (let x in this.usageMap[roomName]) {
				for (let y in this.usageMap[roomName][x]) {
					// Convert to numbers
					x = +x;
					y = +y;

					// Run all hooks
					this._manageRoad(roomName, x, y, this.usageMap[roomName][x][y]);
				}
			}
		}
	}

	run() {
		// Use all tiles with creeps on them
		this.roomManager.find(FIND_MY_CREEPS, {
			roomStatuses: [
				ScoutManager.CLAIMABLE
			]
		}).forEach(c => {
			if (c.memory.role !== "builder") {
				this._useTile(c.room.name, c.pos.x, c.pos.y);
			}
		});

		// Every now and then, lower usage of the tiles by 10%
		if (Game.time % RoadManager.mapDecayInterval === 0) {
			this._reduceTileUsage();
		}

		// Iterate over the entire usage map every now and then
		if (Game.time % RoadManager.mapIterationInterval === 0) {
			this._doMapStuff();
		}
	}

	/**
	 * Percentage to reduce road use
	 */
	static get mapDecayPercentage() {
		return 0.9;
	}

	/**
	 * Usage a tile must have before it gets a road
	 */
	static get usageForRoad() {
		return 25;
	}

	/**
	 * Time before the usage of a tile decreases
	 */
	static get mapDecayInterval() {
		return 499;	// Prime
	}

	/**
	 * Time between each iteration of the usage map
	 */
	static get mapIterationInterval() {
		return 53;	// Prime
	}

	/**
	 * Minimum health a road can have before being queued for repairs, in fraction of max hitpoints;
	 */
	static get minRoadHealth() {
		return 0.5;
	}
}

module.exports = RoadManager;
