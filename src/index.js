const server = require('./server');
const runIndexer = require('./priceIndexer/runIndexer');
const cron = require('node-cron');

// runIndexer();

// cron.schedule('30 23 * * *', async () => {
// 	await runIndexer();
// 	console.log('running a task every minute');
// });

server.listen({ port }, () => console.log(`Server ready at: ${port}`));