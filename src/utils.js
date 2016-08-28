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
	}
};

module.exports = utils;
