const Mutation = require('./mutation');
const Query = require('./query');
const Organization = require('./organization');

const organizationResolvers = {
	Mutation,
	Query,
	Organization,
};

module.exports = organizationResolvers;