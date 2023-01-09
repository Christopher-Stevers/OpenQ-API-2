const Mutation = require('./mutation');
const Query = require('./query');
const ProAccount = require('./proAccount');
const ProAccounts = require('./proAccounts');

const proAccountResolvers = {
	Mutation,
	Query,
	ProAccount,
	ProAccounts
};

module.exports = proAccountResolvers;