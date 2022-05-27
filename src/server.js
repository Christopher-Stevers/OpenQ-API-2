const { ApolloServer } = require('apollo-server');
const typeDefs = require('./schema');
const resolvers = require('./resolvers');
const indexer = require('./indexer');
const dotenv = require('dotenv');
dotenv.config();

const port = process.env.PORT || 4000;

new ApolloServer({
	resolvers,
	typeDefs,
	csrfPrevention: true,
	cors: {
		origin: 'http://localhost:3000',
		credentials: true
	},
	context: ({ req }) => {
		return { req };
	}
}).listen({ port }, () =>
	console.log(`Server ready at: http://localhost:${port}`)
);

function sleep(ms) {
	return new Promise((resolve) => setTimeout(resolve, ms));
}
const runIndexer = async () => {
	console.log('init, waiting');
	await sleep(1000);
	console.log('running');
	await indexer();
	console.log('completed');
}; /*
runIndexer()
*/
