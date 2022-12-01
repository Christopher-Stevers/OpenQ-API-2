const userAuth = require('../../resolvers/utils/userAuth');

describe('userAuth', () => { 
	it('should return a function', () => {
		expect(typeof userAuth).toBe('function');
	});
});