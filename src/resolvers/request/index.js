const Mutation = require('./mutation');
const Query = require('./query');
const Request = require('./request');
const Requests = require('./requests');

const requestResolvers = {
	Mutation,
	Query,
	Request,
	Requests
};

module.exports = requestResolvers;