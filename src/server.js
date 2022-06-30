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
		origin: ['http://localhost:3000', 'http://openq-frontend:3000', 'http://localhost:8075', 'http://openq-bounty-actions-autotask:8075', 'http://localhost:4000', 'http://openq-api:4000'],
		credentials: true
	}
});

module.exports = server;