const { ApolloServer } = require('apollo-server');
const {
	ApolloServerPluginLandingPageGraphQLPlayground
} = require('apollo-server-core');

const typeDefs = require('./typeDefs');
const resolvers = require('./resolvers');
const createContext = require('./context');
const apolloLogger = require('./plugins/index.js');
const authDirectiveTransformer = require('./utils/auth/authDirectiveTransformer');
const { makeExecutableSchema } = require('@graphql-tools/schema');

let schema = makeExecutableSchema({
	typeDefs,
	resolvers
});

schema = authDirectiveTransformer(schema, 'auth');

const server = new ApolloServer({
	schema,
	context: createContext,
	plugins: [apolloLogger, ApolloServerPluginLandingPageGraphQLPlayground],
	introspection: true,
	cors: {
		origin: [...process.env.ORIGIN.split(','), 'http://localhost:3002'],
		credentials: true
	}
});

module.exports = server;