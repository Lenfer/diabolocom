'use strict';


let start = 1385710405;
let logLength = 40000000;

function getRandomInt(min, max) {
	return Math.floor(Math.random() * (max - min + 1)) + min;
}



while (logLength--) {
	let end = start + getRandomInt(100, 2000);
	console.log(`${start}:${end}`)
	start = start + getRandomInt(0, 1500)
}

