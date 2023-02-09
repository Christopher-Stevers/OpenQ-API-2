const query = require('./query');
const mutation = require('./mutation');

const batch = require('./batch');
const bounty = require('./bounty');
const organization = require('./organization');
const price = require('./price');
const request = require('./request');
const user = require('./user');
const JSON = require('./JSON');
const submission = require('./submission');
const repository = require('./repository');
const paginationInt = require('./paginationInt');

const schema = [
	query,
	mutation,
	...bounty,
	...organization,
	...price,
	...user,
	...batch,
	...JSON,
	...submission,
	...repository,
	...request,
	...paginationInt,
];

module.exports = schema;
