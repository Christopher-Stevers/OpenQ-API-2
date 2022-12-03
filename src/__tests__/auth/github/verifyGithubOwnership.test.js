const verifyGithubOwnership = require('../../../utils/auth/github/verifyGithubOwnership');

const axios = require('axios');
const MockAdapter = require('axios-mock-adapter');

describe('verifyGithubOwnership', () => { 
	let mock;
	
	let req = {
		headers: {
			cookie: 'github_oauth_token_unsigned=123456789'
		}
	};

	const userId = '123456789';

	const viewerData = {
		data: { viewer: { login: 'FlacoJones', id: userId } }
	};

	beforeAll(() => {
		mock = new MockAdapter(axios);
	});

	beforeEach(() => {
		mock.reset();
	});

	describe('success', () => { 
		it('should return true if the user is the owner of the token', async () => {
			mock.onPost('https://api.github.com/graphql').reply(200, viewerData);

			const result = await verifyGithubOwnership(req, userId);
			expect(result).toBe(true);
		});
	 });
});