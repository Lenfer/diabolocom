'use strict';

const fs = require('fs');
const filename = process.argv[2];

/**
 * Read file by filename and return his content
 * @private
 * @param {String} filename Path to text file
 * @returns {String} [description]
 */
function readFileSync(filename) {
	try {
		return fs.readFileSync(filename).toString();
	} catch (e) {
		console.error(`No found file by path ${filename}`);
		return '';
	}
}


let wordCounting = {
	/**
	 * Read file by filename and count words
	 * @param {String} filename Path to text file
	 * @returns {String}
	 */
	process: (filename) => {
		let result = [];
		let content = readFileSync(filename);

		// If no content
		if (!content) {
			return '';
		}

		// replace word breaking
		content = content.replace(/\-(\r\n?|\n)/g, '');

		// match all words
		let matched = content.match(/[a-z][\w\d'\-]{2,}/gi);
		let matchedObj = {};

		// Count number of occurrence
		matched.forEach((word) => {
			let lowerWord = word.toLowerCase();
			if (matchedObj[lowerWord]) {
				matchedObj[lowerWord]++;
			} else {
				matchedObj[lowerWord] = 1;
			}
		})

		// convert to array and order
		result= Object.getOwnPropertyNames(matchedObj)
			.sort((wordA, wordB) => {
				let occurCntA = matchedObj[wordA];
				let occurCntB = matchedObj[wordB];
				// Sort by number of occurrences
				if (occurCntA > occurCntB) {
					return -1;
				}
				if (occurCntA < occurCntB) {
					return 1;
				}
				// If count of occurrence equal then sort by word
				if (occurCntA === occurCntB) {
					if (wordA < wordB) {
						return -1;
					}
					if (wordA > wordB) {
						return 1;
					}
					if (wordA === wordB) {
						return 0;
					}
				}
			})
			// Convert to string "Word 1 : Number of occurrences for the word 1"
			.map((word) => `${word}: ${matchedObj[word]}`)
		return result.join('\n');
	}
};

module.exports = wordCounting;

