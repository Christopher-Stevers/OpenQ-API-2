const chooseContext = require('../../chooseContext');
const { createContext, createMockContext } = require('../../context');

describe('chooseContext', () => { 
	it('should return createContext if DEPLOY_ENV is production', () => {
		const context = chooseContext('production');
		expect(context).toBe(createContext);
	});

	it('should return createContext if DEPLOY_ENV is development', () => {
		const context = chooseContext('development');
		expect(context).toBe(createMockContext);
	});

	it('should throw error if DEPLOY_ENV is anything else', () => {
		// write an expect statement to check that the error is thrown
		expect(() => chooseContext('anything else')).toThrow('ENVIRONMENT NOT CONFIGURED CORRECTLY. Set an environment with DEPLOY_ENV');
	});
});