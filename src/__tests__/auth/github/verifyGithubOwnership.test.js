const verifyGithubOwnership = require('../../../utils/auth/github/verifyGithubOwnership');

const axios = require('axios');
const MockAdapter = require('axios-mock-adapter');

const {
	GITHUB_OAUTH_TOKEN_LACKS_PRIVILEGES,
	RATE_LIMITED,
	INVALID_GITHUB_OAUTH_TOKEN,
	NO_GITHUB_OAUTH_TOKEN
} = require('../../../utils/auth/github/errors/errors');

describe('verifyGithubOwnership', () => { 
	let mock;
	
	let req = {
		headers: {
			cookie: 'github_oauth_token_unsigned=123456789'
		}
	};

	const userId = process.env.OTHER_GITHUB_USER_ID;
	const login = process.env.GITHUB_USER_LOGIN;

	const viewerData = {
		data: { viewer: { login, id: userId } }
	};

	beforeAll(() => {
		mock = new MockAdapter(axios);
	});

	beforeEach(() => {
		mock.reset();
	});

	describe('Success', () => {
		it('should return true if the user is the owner of the token', async () => {
			mock.onPost('https://api.github.com/graphql').reply(200, viewerData);

			const result = await verifyGithubOwnership(req, userId);
			expect(result).toMatchObject({githubIsValid: true, login});
		});
	});

	describe('Errors', () => {
		it('NO_GITHUB_OAUTH_TOKEN', async () => {
			const reqWithNoCookie = {
				headers: {
					cookie: 'foo=bar'
				}
			};

			await expect(verifyGithubOwnership(reqWithNoCookie, userId)).rejects.toEqual(NO_GITHUB_OAUTH_TOKEN({ userId }));
		});

		it('RATE_LIMITED', async () => {
			const rateLimitedErrorResponse = {
				errors: [
					{type: 'RATE_LIMITED'}
				]
			};

			mock.onPost('https://api.github.com/graphql').reply(200, rateLimitedErrorResponse);
			
			await expect(verifyGithubOwnership(req, userId)).rejects.toEqual(RATE_LIMITED({ userId }));
		});

		it('INVALID_GITHUB_OAUTH_TOKEN', async () => {
			const otherUserId = 'otherUserId';
			const otherViewerData = {
				data: { viewer: { login: 'FlacoJones', id: otherUserId } }
			};

			mock.onPost('https://api.github.com/graphql').reply(200, otherViewerData);
			await expect(verifyGithubOwnership(req, userId)).rejects.toEqual(GITHUB_OAUTH_TOKEN_LACKS_PRIVILEGES({ userId, viewerUserId: otherUserId }));
			
		});

		it('GITHUB_OAUTH_TOKEN_LACKS_PRIVILEGES', async () => {
			mock.onPost('https://api.github.com/graphql').reply(401);
			await expect(verifyGithubOwnership(req, userId)).rejects.toEqual(INVALID_GITHUB_OAUTH_TOKEN({ userId, }));
			
		});
	});
});