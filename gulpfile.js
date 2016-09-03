"use strict";

// Get the all important gulp package
const gulp = require("gulp");

// Get other packages
const fs = require("fs");

// Define source paths
const srcPath = "src";
const configPath = srcPath + "/config";
const roomConfigPath = configPath + "/roomConfigs";

// File to write config to
const configFile = srcPath + "/config.js";

// Define destination paths
const screepsDir = "../screeps.com";
const prodDest = screepsDir + "/prod";
const simDest = screepsDir + "/sim";

/**
 * Copies all js files to the destination
 *
 * @param {String} destinationPath	Where to put the files
 *
 * @param
 */
function copyJsFiles(destinationPath) {
	return gulp.src(srcPath + "/*.js")
		.pipe(gulp.dest(destinationPath));
}

/*********
 * Tasks *
 *********/

// Builds to production
gulp.task("prod", ["config"], () => {
	return copyJsFiles(prodDest);
});

// Builds to simulator
gulp.task("sim", ["config"], () => {
	return copyJsFiles(simDest);
});

// Builds the config. Very very hacky, but works
gulp.task("config", cb => {
	// The config string
	let config = "\"use strict\";\n\nmodule.exports = {";

	// Find all room configs
	{
		config = config + "\n\troomConfigs: {";
		let rooms = fs.readdirSync(roomConfigPath).filter(name => name.charAt(0) !== ".");
		rooms.forEach(filename => {
			// Read the config file
			let roomConfig = fs.readFileSync(roomConfigPath + "/" + filename, "utf-8");
			roomConfig = roomConfig.replace(/\n}\n/, "\n},");
			roomConfig = roomConfig.replace(/\n/g, "\n\t\t");

			// Parse out the room name
			let roomname = filename.split(".")[0];

			// Put it into the config string
			config = config + "\n\t\t" + roomname + ": " + roomConfig;
		});
		// Remove the last comma from the room configs
		config = config.replace(/,$/, "");

		// Put on the closing bracket for the room config
		config = config + "\n\t}";
	}

	// Remove the final comma from the room configs
	config = config.replace(/,$/, "");

	// Put on the final closing bracket
	config = config + "\n};";

	// Write the config to file
	let ws = fs.createWriteStream(configFile);
	ws.end(config);

	ws.on("finish", cb);
});

// Complains that it has not been given any target
gulp.task("default", () => {
	throw new Error("prod or sim?");
});
