const bountyResolvers = require('./bounty');
const priceResolvers = require('./price');
const userResolvers = require('./user');
const prResolvers = require('./pr');
const contributorResolvers = require('./contributor');

const resolvers = [bountyResolvers, priceResolvers, userResolvers, prResolvers, contributorResolvers];

module.exports = resolvers;