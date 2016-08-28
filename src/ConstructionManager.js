"use strict";

const WorkforceManager = require("WorkforceManager");
const PriorityQueue = require("PriorityQueue");

class ConstructionManager extends WorkforceManager {
	constructor(roomManager) {
		super(roomManager.spawnManager);

		/**
		 * The room manager for this construction manager
	 	 */
		this.roomManager = roomManager;
	}

	/**
	 * The memory object for this construction manager
	 */
	get memory() {
		if (this.roomManager.memory.constructionManager === undefined) {
			this.roomManager.memory.constructionManager = {};
		}
		return this.roomManager.memory.constructionManager;
	}

	/**
	 * The name of this workforce
	 */
	get workforceName() {
		return this.roomManager.roomName + ".constructionManager";
	}

	/**
	 * Map of creeps wanted for this manager, with role names as the key
	 */
	get wantedCreeps() {
		return require("wantedCreepsFor" + this.roomManager.roomName).constructionManager;
	}

	/**
	 * The priority queue for construction sites
	 */
	get constructionQueue() {
		if (this._constructionQueue === undefined) {
			if (this.memory.constructionQueue === undefined) {
				this.memory.constructionQueue = [];
			}
			this._constructionQueue = new PriorityQueue(this.memory.constructionQueue);
		}
		return this._constructionQueue;
	}

	/**
	 * Starts to manage unmanaged constructions
	 *
	 * @private
	 */
	_manageUnmanagedConstructionSites() {
		return this.roomManager.find(FIND_CONSTRUCTION_SITES, {
			filter: site => {
				return site.my && this.constructionQueue.queue.indexOf(site.id) < 0;
			}
		})
		.forEach(site => this.constructionQueue.add(site.id));
	}

	/**
	 * Gets a construction site
	 *
	 * @return {ConstructionSite}	A construction site, or null if there are no construction sites
	 */
	getConstructionSite() {
		let site = null;

		// The site could already be finished. Look for the first non-finished site
		while (site === null && this.constructionQueue.size !== 0) {
			site = Game.getObjectById(this.constructionQueue.peek());
			if (site === null) {
				// Yup, it was finished (or removed). Remove it from the queue
				this.constructionQueue.shift();
			}
		}

		return site;
	}

	run() {
		// Search for unmanaged sites every now and then
		if (Game.time % ConstructionManager.findNewSitesInterval === 0) {
			this._manageUnmanagedConstructionSites();
		}

		super.run();
	}

	/**
	 * How many ticks should pass between each time to look for new sites
	 */
	static get findNewSitesInterval() {
		return 31;	// Prime
	}
}

module.exports = ConstructionManager;
