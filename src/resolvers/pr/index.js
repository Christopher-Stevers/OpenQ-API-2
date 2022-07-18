const Mutation = require('./mutation');
const Query = require('./query');
const PR = require('./pr');

const prResolvers = {
	Mutation,
	Query,
	PR
};

module.exports = prResolvers;