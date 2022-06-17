const { ApolloServer } = require('apollo-server');

const typeDefs = require('./typeDefs');
const resolvers = require('./resolvers');
const createContext = require('./context');
const apolloLogger = require('./plugins/index.js');

// console.log(JSON.stringify(typeDefs));

const server = new ApolloServer({
	typeDefs,
	resolvers,
	context: createContext,
	plugins: [apolloLogger],
	cors: true
});

module.exports = server;