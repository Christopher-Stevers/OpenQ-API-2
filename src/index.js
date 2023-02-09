const server = require('./server');
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

async function startApolloServer() {
	const app = express();
	const corsOptions = {
		origin: [...process.env.ORIGIN.split(',')],
		credentials: true,
	};

	await server.start();
	app.use(bodyParser.json({ limit: '2.4kb' }));
	app.use(cors(corsOptions));
	server.applyMiddleware({ app, cors: corsOptions, path: '/' });
	// Middleware function to limit the size of incoming requests

	app.listen({ port: 4000 }, () =>
		console.log(
			`🚀 Server ready at http://localhost:4000${server.graphqlPath}`
		)
	);
}
startApolloServer();
