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
	server.applyMiddleware({ app, cors: corsOptions, path: '/' });
	// Middleware function to limit the size of incoming requests

	const MAX_REQUEST_SIZE = 1024 * 1024;
	const limitRequestSize = (req, res, next) => {
		const payloadSize = Buffer.byteLength(JSON.stringify(req.body));
		if (payloadSize > MAX_REQUEST_SIZE) {
			res.status(413).send('Payload too large');
		} else {
			next();
		}
	};

	// Apply the middleware function to all incoming requests
	app.use(limitRequestSize);
	app.use(cors(corsOptions));

	app.listen({ port: 4000 }, () =>
		console.log(
			`🚀 Server ready at http://localhost:4000${server.graphqlPath}`
		)
	);
}
startApolloServer();
