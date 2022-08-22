const Query = require('./query');
const Mutation = require('./mutation');
const User = require('./user');

const bountyResolvers = {
	Query,
	Mutation,
	User
};

module.exports = bountyResolvers;