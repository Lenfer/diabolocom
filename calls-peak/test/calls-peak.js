'use strict';
const callsPeak = require('..');
const assert = require('assert');
const fs = require('fs');
const path = require('path');
const join = path.join;
const consoleError = console.error;


describe('#call-peak', () => {
	it('Wrong filename should return empty string and log error', (done) => {
		let fn = 'wrong/file/name';
		let result = callsPeak.process(fn, (res, err) => {
			assert.equal(res, '');
			assert.equal(err, "ENOENT: no such file or directory, access 'wrong/file/name'");
			done();
		});
	});

	it('Empty file should return string with message about no record', (done) => {
		let result = callsPeak.process(join(__dirname, './testEmpty.txt'), (res, err) => {
			assert.equal(res, 'No simultaneous calls in log');
			assert.equal(err, null);
			done();
		});
	});

	it('Should return string with ordered list', function(done) {
		let result = callsPeak.process(join(__dirname, './calls.log'), (res, err) => {
			assert.equal(res._maxCount, 5);
			assert.equal(res._maxStart, 1385727413);
			assert.equal(res._minEnd, 1385727409);
			assert.equal(err, null);
			done();
		});
	});
})


