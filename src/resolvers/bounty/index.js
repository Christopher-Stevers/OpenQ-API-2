const Mutation = require('./mutation');
const Query = require('./query');
const Bounty = require('./bounty');
const Bounties = require('./bounties');

const bountyResolvers = {
	Mutation,
	Query,
	Bounty,
	Bounties
};

module.exports = bountyResolvers;