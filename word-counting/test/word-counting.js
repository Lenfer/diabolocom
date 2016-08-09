'use strict';
const wordCounting = require('..');
const assert = require('assert');
const fs = require('fs');
const path = require('path');
const join = path.join;
const consoleError = console.error;


describe('#word-counting', function() {
	let lastErrMsg = '';
	beforeEach(function() {
		lastErrMsg = '';
		console.error = function(msg) {
			lastErrMsg = msg;
		}
	});

	afterEach(function() {
		console.error = consoleError;
	});

	it('Wrong filename should return empty string and log error', function() {
		let fn = 'wrong/file/name';
		let result = wordCounting.process(fn);
		assert.equal(result, '');
		assert.equal(lastErrMsg, `No found file by path ${fn}`);
	});

	it('Empty file should return empty string and no log', function() {
		let result = wordCounting.process(join(__dirname, './testEmpty.txt'));
		assert.equal(result, '');
		assert.equal(lastErrMsg, '');
	});

	it('Should return string with ordered list', function() {
		let result = wordCounting.process(join(__dirname, './testA.txt'));
		let expected = fs.readFileSync(join(__dirname, 'testA.result.txt')).toString();
		assert.equal(result, expected);
	});
})


