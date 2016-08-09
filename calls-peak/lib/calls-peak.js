'use strict';

const fs = require('fs');
const readline = require('readline');
const filename = process.argv[2];

/**
 * Create read line interface
 * @private
 * @param {String} filename Path to text file
 * @returns {Object}
 */
function createReadLineInterface(filename) {
	// Check file exists
	try {
		fs.accessSync(filename);
	} catch(error) {
		return error;
	}

	// Create interface with read stream
	let readStream = fs.createReadStream(filename)
	let lineReader = readline.createInterface({
		input: readStream
	});
	return lineReader;
}


let timeRange = {
	_maxCount: null,
	_maxStart: null,
	_minEnd: null,


	/**
	 * Regexp for test log line string
	 * @type {RegExp}
	 */
	formatTest: /\d+:\d+/,


	/**
	 * Current calls count in 1 second
	 * @type {Array}
	 */
	calls: [],


	/**
	 * Add new log line to list
	 * @param {String} logLine Log line
	 */
	add: function (logLine) {
		// If empty or none format string
		if (!this.formatTest.test(logLine)) {
			return '';
		}
		// Parse log string
		let tsSplited = logLine.split(':');
		let call = {
			start: +tsSplited[0],
			end: +tsSplited[1]
		};
		this.calls.push(call);
		this.recalc();
	},


	/**
	 * Recalc max calls count and ts range for current list
	 * @param {Boolean} [force=false] Forcibly recal
	 */
	recalc: function (force) {
		let calls = this.calls;
		let callsLen = calls.length;
		let maxEnd = calls[callsLen - 1].start - 1000;

		// Remove calls out of time range
		this.calls = calls.filter((call) => {
			return call.end > maxEnd
		})

		// It`s mean what one or more calls drops
		if (callsLen > this.calls.length || force) {
			!force && calls.pop();
			let newMax = calls.length;

			// If new length great then max value
			if (this._maxCount < newMax) {
				this._maxCount = newMax;

				// Calc time range for current list
				let startList = [];
				let endList = [];
				calls.forEach((call) => {
					startList.push(call.start);
					endList.push(call.end);
				});

				// Set values
				this._maxStart = Math.max.apply(null, startList);
				this._minEnd = Math.min.apply(null, endList);
			}


		}
	},


	/**
	 * Convert to string
	 * @returns {String}
	 */
	toString: function() {
		let message = 'No simultaneous calls in log';
		if (this._maxCount) {
			// Maybe need revert
			if (this._maxStart > this._minEnd) {
				let tmpStart = this._maxStart;
				this._maxStart = this._minEnd;
				this._minEnd = tmpStart;
			}
			message = [
				`The peak for this call log is ${this._maxCount} simultaneous calls,`,
				` that occurred between ${this._maxStart} and ${this._minEnd}.`
			].join('');
		}
		return message;
	}
};


let callsPeak = {
	// Export for test
	_createReadLineInterface: createReadLineInterface,

	/**
	 * Read file line by line and find and count calls peak at second
	 * @param {String} filename Path to log file
	 * @param {Function} callback Callback function
	 * @returns {String}
	 */
	process: (filename, callback) => {
		let readIface = createReadLineInterface(filename);
		if (readIface.message) {
			return callback('', readIface.message);
		}
		readIface.on('line', (line) => timeRange.add(line));
		readIface.on('close', () => {
			timeRange._maxCount && timeRange.recalc(true);
			callback(timeRange, null)
		})
	}
};

module.exports = callsPeak;
