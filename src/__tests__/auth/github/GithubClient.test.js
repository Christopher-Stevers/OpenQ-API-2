const GithubClient = require('../../../utils/auth/github/GithubClient');

describe('GithubClient', () => { 
	const req = {
		headers: {
			cookie: `github_oauth_token_unsigned=${process.env.GITHUB_OAUTH_TOKEN}`,
		}
	};

	const req_NO_OAUTH_TOKEN = {
		headers: {
			cookie: 'foo=bar',
		}
	};

	const userId = process.env.GITHUB_USER_ID;
	const otherUserId = process.env.OTHER_GITHUB_USER_ID;

	it('GithubClient.verifyGithub should return TRUE if the OAuth Token matches the given userId', async () => {
		const result = await GithubClient.verifyGithub(req, userId);
		expect(result).toEqual(true);
	});

	it('GithubClient.verifyGithub should return FALSE if the OAuth Token is not present', async () => {
		try {
			await GithubClient.verifyGithub(req_NO_OAUTH_TOKEN, userId);
			throw Error('should not reach here');
		} catch (error) {
			expect(error.type).toEqual('NO_GITHUB_OAUTH_TOKEN');
		}
	});

	it('GithubClient.verifyGithub should return FALSE if the OAuth Token does not match the desired userId', async () => {
		try {
			await GithubClient.verifyGithub(req, otherUserId);
			throw Error('should not reach here');
		} catch (error) {
			expect(error.type).toEqual('INVALID_GITHUB_OAUTH_TOKEN');
		}
	});
});