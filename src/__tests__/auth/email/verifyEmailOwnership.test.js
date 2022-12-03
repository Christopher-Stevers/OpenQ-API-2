const verifyEmailOwnership = require('../../../utils/auth/email/verifyEmailOwnership');

const axios = require('axios');
const MockAdapter = require('axios-mock-adapter');

describe('verifyEmailOwnership', () => { 
	let mock;
	
	const req = {
		headers: {
			cookie: `email_auth=${process.env.GITHUB_OAUTH_TOKEN}`,
		}
	};

	const req_NO_OAUTH_TOKEN = {
		headers: {
			cookie: 'foo=bar',
		}
	};

	const email = process.env.EMAIL;

	const magicLinkResponse = {
		data: { foo: 'bar' }
	};

	beforeAll(() => {
		mock = new MockAdapter(axios);
	});

	beforeEach(() => {
		mock.reset();
	});

	describe('Success', () => {
		it('should return true if the user is the owner of the token', async () => {
			mock.onPost('https://api.github.com/graphql').reply(200, magicLinkResponse);

			const result = await verifyEmailOwnership(req, email);
			expect(result).toBe(true);
		});
	});

	describe('Errors', () => {
		it('INVALID_TOKEN', async () => {
			const reqWithNoCookie = {
				headers: {
					cookie: 'foo=bar'
				}
			};

			await expect(verifyEmailOwnership(reqWithNoCookie, email)).rejects.toEqual({});
		});
	});
});