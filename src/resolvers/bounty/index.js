const Mutation = require('./mutation');
const Query = require('./query');
const Bounty = require('./bounty');

const bountyResolvers = {
	Mutation,
	Query,
	Bounty
};

module.exports = bountyResolvers;