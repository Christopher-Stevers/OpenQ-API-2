const Mutation = require('./mutation');
const Query = require('./query');
const Submission = require('./submission');

const prResolvers = {
	Mutation,
	Query,
	Submission
};

module.exports = prResolvers;