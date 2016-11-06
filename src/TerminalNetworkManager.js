"use strict";

const Manager = require("Manager");

/**
 * Handles transactions between all terminals in the empire
 */
class TerminalNetworkManager extends Manager {
	constructor(config) {
		super();

		this.config = _.defaults(config, {});
	}

	/**
	 * The memory object for the terminal network manager
	 */
	get memory() {
		if (this.empireManager.memory.terminalNetworkManager === undefined) {
			this.empireManager.memory.terminalNetworkManager = {};
		}
		return this.empireManager.memory.terminalNetworkManager;
	}

	/**
	 * Distributes resources between the terminals
	 */
	distributeResources() {
		// Collect data from all terminal managers
		let data = {};
		Object.keys(this.empireManager.roomManagers).forEach(roomName => {
			data[roomName] = {
				abundant: this.empireManager.roomManagers[roomName].terminalManager.abundantResources,
				scarce: this.empireManager.roomManagers[roomName].terminalManager.scarceResources
			};
		});

		// Process the data
		for (let sourceRoomName in data) {

			// Iterate over the resources this room has in abundance
			for (let resourceType in data[sourceRoomName].abundant) {

				// Need to know if the terminal in this room has been told to transfer, so it's not told to twice
				let sent = false;

				// Check if any of the other rooms lack this resource
				for (let destinationRoomName in data) {

					// Find out how much the room is lacking
					let lacking = data[destinationRoomName].scarce[resourceType];

					// Is it lacking this resource?
					if (lacking) {

						// Calculate how much to send
						let amountToSend = Math.min(lacking, data[sourceRoomName].abundant[resourceType]);

						// Get the terminal
						let terminal = this.empireManager.roomManagers[sourceRoomName].terminalManager.terminal;

						// Try to send it
						let status = terminal.send(resourceType, amountToSend, destinationRoomName);

						// Did it go well?
						if (status === OK) {
							// Yup! Reduce the scarce amount
							data[destinationRoomName].scarce[resourceType] -= amountToSend;

							// Reduce the abundant amount
							data[sourceRoomName].abundant[resourceType] -= amountToSend;

							// Remove the resource from the abundant/scarce objects if the amount is reduced to 0
							if (data[destinationRoomName].scarce[resourceType] === 0) {
								delete data[destinationRoomName].scarce[resourceType];
							}
							if (data[sourceRoomName].abundant[resourceType] === 0) {
								delete data[sourceRoomName].abundant[resourceType];
							}

							// Mark the terminal as used
							sent = true;
							break;
						}
					}
				}

				// Stop process
				if (sent) break;
			}
		}
	}

	/**
	 * Sells off resources which have taken their quota in terminals
	 */
	sellResources() {
		// Cache object for all orders
		let allOrders = null;

		// Iterate over all the rooms
		Object.keys(this.empireManager.roomManagers).forEach(roomName => {
			// Grab the terminal manager and the terminal
			let terminalManager = this.empireManager.roomManagers[roomName].terminalManager;
			let terminal = terminalManager.terminal;

			// Check if the terminal exists
			if (terminal !== undefined) {

				// Iterate over all the stuff in the terminal
				for (let resourceType in terminal.store) {

					// Get amount of this resource type in the terminal
					let amount = terminal.store[resourceType];

					// Skip energy and resources not at their max levels
					if (resourceType !== RESOURCE_ENERGY && amount >= terminalManager.maximumOfEachResource) {
						// Reduce amount so that it leaves the minimum amount
						amount -= terminalManager.minimumOfEachResource;

						// Check if the orders are cached
						if (allOrders === null) {
							allOrders = Game.market.getAllOrders(o => o.type === ORDER_BUY);
						}

						// Go through the market for orders of this type which can receive all the resources
						let orders = allOrders.filter(o => o.resourceType === resourceType && o.amount >= amount);

						// Find the one which sells for most	TODO Weigh by distance and price
						let order = orders.reduce((best, current) => {
							if (current.price > best.price) {
								// Current is better than best
								best = current;
							} else if (current.price === best.price) {
								// They are the same. Which costs the least energy?
								let currentCost = Game.market.calcTransactionCost(amount, roomName, current.roomName);
								let bestCost = Game.market.calcTransactionCost(amount, roomName, current.roomName);
								if (currentCost < bestCost) {
									best = current;
								}
							}
							return best;
						}, {price: -Number.MAX_SAFE_INTEGER});

						// Do the deal if the price is at least 1 credit
						if (order.price >= 1) {
							Game.market.deal(order.id, amount, roomName);
						}
					}
				}
			}
		});
	}

	run() {
		// Distribute resources if the time is right
		if (Game.time % TerminalNetworkManager.resourceDistributionInterval === 0) {
			this.distributeResources();
		}
		// Sell off resources the next tick
		if ((Game.time-1) % TerminalNetworkManager.resourceDistributionInterval === 0) {
			this.sellResources();
		}
	}

	/**
	 * Resource distribution interval
	 */
	static get resourceDistributionInterval() {
		return 97;	// Prime
	}
}

module.exports = TerminalNetworkManager;
