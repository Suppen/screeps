"use strict";

const TerminalNetworkManager = require("TerminalNetworkManager");

/**
 * Useful utility functions
 */
const utils = {
	/**
	 * Finds the element in an array closest to a position. Note that the 'distance' property of the elements are created or overwritten in the process
	 *
	 * @param {RoomPosition} pos	The position to search from
	 * @param {Object[]} elements	An array of objects which have a room position, or an array of room positions
	 *
	 * @return {Object}	The element in the array closest to the given position
	 */
	findClosest(pos, elements) {
		return elements.reduce((closest, current) => {
			current.distance = pos.getRangeTo(current);
			if (current.distance < closest.distance) {
				closest = current;
			}
			return closest;
		}, {distance: Number.MAX_SAFE_INTEGER});
	},
	/**
	 * Finds dropoffs. Must be bound to a creep controlled by an energy manager
	 */
	energyCollectorFindDropoff() {
		// Find all possible dropoffs
		let dropoffs = this.energyManager.allDropoffs;

		// The selected dropoff
		let dropoff = null;

		// First, check for links
		if (dropoffs.links.length > 0) {
			let link = this.creep.pos.findClosestByRange(dropoffs.links);

			// Only go for nearby links, within 2 tiles, and NOT the one which was just picked up from
			if (this.creep.pos.getRangeTo(link) <= 3) {
				dropoff = link;
			}
		}

		// Then, go for extensions and spawns
		if (dropoff === null && (dropoffs.extensions.length > 0 || dropoffs.spawns.length > 0)) {
			// Find the closest one
			dropoff = this.creep.pos.findClosestByRange(dropoffs.extensions.concat(dropoffs.spawns));
		}

		// Still none? Check for towers
		if (dropoff === null && dropoffs.towers.length > 0) {	
			dropoff = this.creep.pos.findClosestByRange(dropoffs.towers);
		}

		// All towers full, too? Check for labs
		if (dropoff === null && dropoffs.labs.length > 0) {
			dropoff = this.creep.pos.findClosestByRange(dropoffs.labs);
		}

		// Fill up the nuke
		if (dropoff === null && dropoffs.nuke !== null) {
			dropoff = dropoffs.nuke;
		}

		// Does the terminal have capacity for more energy?
		if (dropoff === null && dropoffs.terminal !== null && dropoffs.terminal.store.energy < TerminalNetworkManager.maxEnergy) {
			dropoff = dropoffs.terminal;
		}

		// Last chance: The storage!
		if (dropoff === null && dropoffs.storage !== null) {
			dropoff = dropoffs.storage;
		}

		return dropoff;
	}
};

module.exports = utils;
