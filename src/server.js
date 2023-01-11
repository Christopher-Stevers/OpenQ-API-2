const { ApolloServer } = require('apollo-server');
const {
	ApolloServerPluginLandingPageGraphQLPlayground
} = require('apollo-server-core');
const dotenv = require('dotenv');
dotenv.config();

const typeDefs = require('./typeDefs');
const resolvers = require('./resolvers');
const apolloLogger = require('./plugins/index.js');
const { makeExecutableSchema } = require('@graphql-tools/schema');
const authDirectiveTransformer = require('./utils/auth/authDirectiveTransformer');
const chooseContext = require('./chooseContext');

const authDirectiveTypeDefs = (directiveName) =>  `
  directive @${directiveName} on FIELD_DEFINITION`;
let schema = makeExecutableSchema({
	typeDefs: [typeDefs, authDirectiveTypeDefs('auth')],
	resolvers
});

schema = authDirectiveTransformer(schema, 'auth');

const context = chooseContext(process.env.DEPLOY_ENV);

const server = new ApolloServer({
	schema,
	context,
	plugins: [apolloLogger, ApolloServerPluginLandingPageGraphQLPlayground],
	introspection: true,
	cors: {
		origin: [...process.env.ORIGIN.split(','), 'http://localhost:3002', ],
		credentials: true
	}
});

module.exports = server;