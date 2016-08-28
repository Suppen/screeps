"use strict";

/**
 * Simple priority queue, with O(n) for everything
 */
class PriorityQueue {
	/**
	 * Creates a new priority queue
	 *
	 * @param {Array} arr	Reference to the array used to store the priority queue in
	 */
	constructor(array) {
		this._queue = array;
	}

	/**
	 * The elements in the queue
	 */
	get queue() {
		return this._queue.map(e => e.element);
	}

	/**
	 * The current size of the queue
	 */
	get size() {
		return this._queue.length;
	}

	/**
	 * Adds an element to the queue, with a specified priority
	 *
	 * @param {Any} element	The element to store in the queue
	 * @param {Integer} [priority]	Priority to give to the element. Lower number = higher priority. Defaults to 1000
	 *
	 * @return {Integer} i	The 0-indexed number the element now has in the queue. This may change both ways as more elements are inserted
	 */
	add(element, priority) {
		// Make a queue element
		let elem = new QueueElement(element, priority);

		// Put it in the right place in the queue
		let i = this._queue.findIndex(e => priority < e.priority);
		if (i < 0) {
			i = this._queue.length;
		}
		this._queue.splice(i, 0, elem);
	}

	/**
	 * Gets the first element in the queue and removes it from the queue
	 *
	 * @return {Any}	The element first in the queue
	 * @throw {Error}	If there are no elements in the queue. Check if it is empty first with 'size'
	 */
	shift() {
		if (this.size === 0) {
			throw new Error("Priority queue is empty");
		}
		let elem = this._queue.shift();
		return elem.element;
	}

	/**
	 * Looks at the first element in the queue without removing it
	 *
	 * @return {Any}	The element first in the queue, or undefined if there are no elements in the queue
	 * @throw {Error}	If there are no elements in the queue. Check if it is empty first with 'size'
	 */
	peek() {
		if (this.size === 0) {
			throw new Error("Priority queue is empty");
		}
		return this.queue[0];
	}
}

class QueueElement {
	constructor(element, priority) {
		this.element = element;
		this.priority = priority;
	}
}

module.exports = PriorityQueue;
