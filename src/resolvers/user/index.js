const Query = require('./query');
const Mutation = require('./mutation');
const User = require('./user');
const Users = require('./users');

const bountyResolvers = {
	Query,
	Mutation,
	User,
	Users
};

module.exports = bountyResolvers;