const { ApolloServer } = require('apollo-server');
const {
	ApolloServerPluginLandingPageGraphQLPlayground
} = require('apollo-server-core');

const typeDefs = require('./typeDefs');
const resolvers = require('./resolvers');
const createContext = require('./context');
const apolloLogger = require('./plugins/index.js');


const server = new ApolloServer({
	typeDefs,
	resolvers,
	context: createContext,
	plugins: [apolloLogger, ApolloServerPluginLandingPageGraphQLPlayground],
	introspection: true,
	cors: {
		origin: process.env.ORIGINS.split(','),
		credentials: true
	}
});

module.exports = server;