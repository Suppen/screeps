"use strict";

const alphabet = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
const length = 5;

/**
 * Creates a reasonably unique random ID
 *
 * @return {String}	A reasonably unique random ID
 */
function makeUID() {
	let uid = new Array(length);
	for (let i = 0; i < uid.length; i++) {
		uid[i] = alphabet[Math.floor(Math.random()*alphabet.length)];
	}
	return uid.join("");
}

module.exports = makeUID;
