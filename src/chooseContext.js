const { createContext, createMockContext } = require('./context');

const chooseContext = (environment) => {
	let context = null;

	if (environment === 'production') {
		context = createContext;
	} else if (environment === 'development') {
		context = createMockContext;
	} else {
		throw new Error('ENVIRONMENT NOT CONFIGURED CORRECTLY. Set an environment with DEPLOY_ENV');
	}

	return context;
};	

module.exports = chooseContext;