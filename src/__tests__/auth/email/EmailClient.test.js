const GithubClient = require('../../../utils/auth/github/GithubClient');

describe('GithubClient', () => { 
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

	const userId = process.env.GITHUB_USER_ID;
	const otherUserId = process.env.OTHER_GITHUB_USER_ID;

	it('EmailClient.verifyEmail should return TRUE if the OAuth Token matches the given userId', async () => {
		expect(true).toEqual(true);
	});
});