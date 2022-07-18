const bountyResolvers = require('./bounty');
const priceResolvers = require('./price');
const userResolvers = require('./user');
const prResolvers = require('./pr');
const organizationResolvers = require('./organization');
const contributorResolvers = require('./contributor');

const resolvers = [bountyResolvers, priceResolvers, userResolvers, prResolvers, contributorResolvers, organizationResolvers];

module.exports = resolvers;