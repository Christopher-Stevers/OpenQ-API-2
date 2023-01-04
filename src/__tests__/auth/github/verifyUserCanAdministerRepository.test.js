const verifyUserCanAdministerRepository = require('../../../utils/auth/github/verifyUserCanAdministerRepository');

const axios = require('axios');
const MockAdapter = require('axios-mock-adapter');

const {
	GITHUB_OAUTH_TOKEN_LACKS_PRIVILEGES,
	RATE_LIMITED,
	INVALID_GITHUB_OAUTH_TOKEN,
	NO_GITHUB_OAUTH_TOKEN
} = require('../../../utils/auth/github/errors/errors');

describe('verifyUserCanAdministerRepository', () => { 
	let mock;
	
	let req = {
		headers: {
			cookie: 'github_oauth_token_unsigned=123456789'
		}
	};

	const repoId = '123456789';

	const viewerCanAdministerRepositoryReturnData = {
		data: { viewer: {login: 'FlacoJones'}, node: { viewerCanAdminister: true } }
	};

	const viewerCanAdministerRepositoryReturnData_FALSE = {
		data: { viewer: {login: 'FlacoJones'}, node: { viewerCanAdminister: false } }
	};

	beforeAll(() => {
		mock = new MockAdapter(axios);
	});

	beforeEach(() => {
		mock.reset();
	});

	describe('Success', () => {
		it('should return true if the user is the owner of the token', async () => {
			mock.onPost('https://api.github.com/graphql').reply(200, viewerCanAdministerRepositoryReturnData);

			const result = await verifyUserCanAdministerRepository(req, repoId);
			expect(result).toBe(true);
		});
	});

	describe('Errors', () => {
		it('NO_GITHUB_OAUTH_TOKEN', async () => {
			const reqWithNoCookie = {
				headers: {
					cookie: 'foo=bar'
				}
			};

			await expect(verifyUserCanAdministerRepository(reqWithNoCookie, repoId)).rejects.toEqual(NO_GITHUB_OAUTH_TOKEN({ id: repoId }));
		});

		it('RATE_LIMITED', async () => {
			const rateLimitedErrorResponse = {
				errors: [
					{type: 'RATE_LIMITED'}
				]
			};

			mock.onPost('https://api.github.com/graphql').reply(200, rateLimitedErrorResponse);
			
			await expect(verifyUserCanAdministerRepository(req, repoId)).rejects.toEqual(RATE_LIMITED({ id: repoId }));
		});

		it('GITHUB_OAUTH_TOKEN_LACKS_PRIVILEGES', async () => {
			mock.onPost('https://api.github.com/graphql').reply(200, viewerCanAdministerRepositoryReturnData_FALSE);
			
			await expect(verifyUserCanAdministerRepository(req, repoId)).rejects.toEqual(GITHUB_OAUTH_TOKEN_LACKS_PRIVILEGES({ id: repoId, viewerUserId: 'FlacoJones'  }));
		});

		it('INVALID_GITHUB_OAUTH_TOKEN', async () => {
			mock.onPost('https://api.github.com/graphql').reply(401);
			await expect(verifyUserCanAdministerRepository(req, repoId)).rejects.toEqual(INVALID_GITHUB_OAUTH_TOKEN({ id:  repoId,}));
		});
	});
});