const bountyResolvers = require('./bounty');
const priceResolvers = require('./price');
const userResolvers = require('./user');
const submissionResolvers = require('./submission');
const organizationResolvers = require('./organization');
const repositoryResolvers = require('./repository');
const permissioinedOrganizationResolvers = require('./permissionedOrganization');
const productResolvers = require('./product');

const resolvers = [bountyResolvers, priceResolvers, userResolvers, submissionResolvers,  organizationResolvers, repositoryResolvers, permissioinedOrganizationResolvers, productResolvers];

module.exports = resolvers;