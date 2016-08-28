"use strict";

console.log("Restarted");

const EmpireManager = require("EmpireManager");

module.exports.loop = function () {
	// Make an empire manager. Need a new one every tick because of silly server architecture which makes state unreliable unless stored in memory as JSON
	let empireManager = new EmpireManager();

	// Put the empire manager on the game object
	Game.empireManager = empireManager;

	// Run the empire manager
	empireManager.run();
};
