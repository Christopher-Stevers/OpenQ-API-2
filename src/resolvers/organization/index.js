const Mutation = require('./mutation');
const Query = require('./query');
const Organization = require('./organization');
const Organizations = require('./organizations');

const organizationResolvers = {
	Mutation,
	Query,
	Organization,
	Organizations
};

module.exports = organizationResolvers;