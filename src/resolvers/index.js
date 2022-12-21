const bountyResolvers = require('./bounty');
const priceResolvers = require('./price');
const userResolvers = require('./user');
const submissionResolvers = require('./submission');
const organizationResolvers = require('./organization');
const repositoryResolvers = require('./repository');

const resolvers = [bountyResolvers, priceResolvers, userResolvers, submissionResolvers,  organizationResolvers, repositoryResolvers];

module.exports = resolvers;