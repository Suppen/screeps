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

	run() {
		// Distribute resources every now and then
		if (Game.time % TerminalNetworkManager.resourceDistributionInterval === 0) {
let startCpu = Game.cpu.getUsed();
console.log("Kake");
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


			for (let destinationRoomName in data) {
				// Check which resources this room lacks
				for (let resourceType in data[destinationRoomName].scarce) {
					// Go through all the abundant resources in the other rooms, and check if a room has an abundance of this type
					for (let sourceRoomName in data) {
						// Check the room only if the terminal has not yet been used in the source room
						if (!data[sourceRoomName].terminalUsed) {
							// Check if the room
						}
					}
				}
			}
		}
	}

	/**
	 * Resource distribution interval
	 */
	static get resourceDistributionInterval() {
		return 599;	// Prime
	}
}

module.exports = TerminalNetworkManager;
