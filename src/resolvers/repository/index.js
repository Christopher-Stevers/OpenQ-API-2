const Mutation = require('./mutation');
const Query = require('./query');
const Repository = require('./repository');
const Repositories = require('./repositories');

const contestResolvers = {
	Mutation,
	Query,
	Repository,
	Repositories
};

module.exports = contestResolvers;