const { ApolloServer } = require('apollo-server');
const cron = require('node-cron');
const typeDefs = require('./schema');
const resolvers = require('./resolvers');
const indexer = require('./indexer');

const port = process.env.PORT || 4000;

new ApolloServer({
	resolvers,
	typeDefs,
}).listen({ port }, () => console.log(`Server ready at: ${port}`));

function sleep(ms) {
	return new Promise((resolve) => setTimeout(resolve, ms));
}
const runIndexer = async () => {
	console.log('init, waiting');
	await sleep(1000);
	console.log('running');
	await indexer();
	console.log('completed');
};
runIndexer();
cron.schedule('30 23 * * *', async () => {
	await runIndexer();
	console.log('running a task every minute');
});
