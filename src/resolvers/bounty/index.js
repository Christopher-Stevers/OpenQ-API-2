const Mutation = require('./mutation');
const Query = require('./query');
const Bounty = require('./Bounty');

const bountyResolvers = {
	Mutation,
	Query,
	Bounty
};

module.exports = bountyResolvers;