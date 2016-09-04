"use strict";

const Manager = require("Manager");

/**
 * Handles movement of energy between links
 */
class LinkManager extends Manager {
	/**
	 * Creates a new 
	 */
	constructor(energyManager) {
		super();

		/**
		 * The energy manager this link manager is part of
		 */
		this.energyManager = energyManager;
	}

	/**
	 * The links managed by this link manager
	 */
	get links() {
		if (this._links === undefined) {
			this._links = this.energyManager.roomManager.room.find(FIND_STRUCTURES, {
				filter(s) {
					return s instanceof StructureLink;
				}
			});
		}
		return this._links;
	}

	/**
	 * Links which can act only as dropoffs
	 */
	get dropoffLinks() {
		if (this._dropoffLinks === undefined) {
			this._dropoffLinks = this.links.filter(l => {
				let flags = this.energyManager.roomManager.room.lookForAt(LOOK_FLAGS, l);
				return flags.reduce((isDropoff, flag) => {
					return flag.color === COLOR_GREEN && flag.secondaryColor === COLOR_RED;
				}, false);
			});
		}
		return this._dropoffLinks;
	}

	/**
	 * Links which can act only as pickups
	 */
	get pickupLinks() {
		if (this._pickupLinks === undefined) {
			this._pickupLinks = this.links.filter(l => {
				let flags = this.energyManager.roomManager.room.lookForAt(LOOK_FLAGS, l);
				return flags.reduce((isDropoff, flag) => {
					return flag.color === COLOR_GREEN && flag.secondaryColor === COLOR_WHITE;
				}, false);
			});
		}
		return this._pickupLinks;
	}

	/**
	 * Transfers energy between links
	 *
	 * @param {StructureLink[]} from	Array of links to transfer from
	 * @param {StructureLink[]} to	Array of links to transfer to
	 *
	 * @private
	 */
	_transferEnergy(from, to) {
		from.forEach(flink => {
			// No need to try if there is no energy, or the link is on cooldown
			if (flink.energy > 0 && flink.cooldown === 0) {
				if (flink.transferred === undefined) {
					flink.transferred = false;
				}
				for (let i = 0; i < to.length && !flink.transferred; i++) {
					let tlink = to[i];

					// Don't send energy to itself, or to a link which is nearly full
					if (flink !== tlink && tlink.energy < (tlink.energyCapacity-50)) {
						if (flink.transferEnergy(tlink) === OK) {
							flink.transferred = true;
						}
					}
				}
			}
		});
	}

	run() {
		// Move some energy around!
		this._transferEnergy(this.dropoffLinks, this.pickupLinks);
	}
}

module.exports = LinkManager;
