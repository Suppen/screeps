"use strict";

// Get the all important gulp package
const gulp = require("gulp");

// Define source paths
const srcPath = "src";
const configPath = srcPath + "/roomConfigs";

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
gulp.task("prod", () => {
	return copyJsFiles(prodDest);
});

// Builds to simulator
gulp.task("sim", () => {
	return copyJsFiles(simDest);
});

// Complains that it has not been given any target
gulp.task("default", () => {
	throw new Error("prod or sim?");
});
