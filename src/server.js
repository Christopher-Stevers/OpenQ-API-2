const { ApolloServer } = require('apollo-server');

const typeDefs = require('./typeDefs');
const resolvers = require('./resolvers');
const createContext = require('./context');
const apolloLogger = require('./plugins/index.js');


const server = new ApolloServer({
	typeDefs,
	resolvers,
	context: createContext,
	plugins: [apolloLogger],
	cors: {
		origin: ["http://localhost:3000", "https://studio.apollographql.com", "http://openq-frontend:3000", "http://docker.host.internal:3000"]
	}
});

module.exports = server;