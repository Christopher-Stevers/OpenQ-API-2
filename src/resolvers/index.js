const bountyResolvers = require('./bounty');
const priceResolvers = require('./price');
const userResolvers = require('./user');

const resolvers = [bountyResolvers, priceResolvers, userResolvers];

module.exports = resolvers;