
const query = require('./query');
const mutation = require('./mutation');

const batch = require('./batch');
const bounty = require('./bounty');
const organization = require('./organization');
const price = require('./price');
const user = require('./user');
const JSON = require('./JSON');
const pr = require('./pr');
const contributor = require('./contributor');

const schema = [query, mutation, ...bounty, ...organization, ...price, ...user, ...batch, ...JSON, ...pr, ...contributor];

module.exports = schema;