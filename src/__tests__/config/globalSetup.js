const server = require('../../server');

const options = {
	port: process.env.PORT
};


const globalSetup = async () => {
	try {
		console.log(`Starting test server on port ${options.port}`);
		global.httpServer = server;
		await global.httpServer.listen(options);
	}
	catch (err) {
		console.log(err);
	}

};

module.exports = globalSetup;