
const query = require('./query');
const mutation = require('./mutation');

const batch = require('./batch');
const bounty = require('./bounty');
const organization = require('./organization');
const price = require('./price');
const user = require('./user');
const JSON = require('./JSON');
const submission = require('./submission');
const repository = require('./repository');
const proAccount = require('./proAccount');
const product = require('./product');

const schema = [query, mutation, ...bounty, ...organization, ...price, ...user, ...batch, ...JSON, ...submission, ...repository, ...proAccount, ...product];

module.exports = schema;