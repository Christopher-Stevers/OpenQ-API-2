const Mutation = require('./mutation');
const Query = require('./query');
const Repository = require('./repository');

const contestResolvers = {
	Mutation,
	Query,
	Repository
};

module.exports = contestResolvers;