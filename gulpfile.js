"use strict";

const gulp = require("gulp");

gulp.task("prod", () => {
	return gulp.src("src/*.js")
		.pipe(gulp.dest("../screeps.com/prod/"));
});

gulp.task("sim", () => {
	return gulp.src("src/*.js")
		.pipe(gulp.dest("../screeps.com/simulator/"));
});

gulp.task("default", () => {
	throw new Error("prod or sim?");
});
