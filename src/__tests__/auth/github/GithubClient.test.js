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
	const repoId = process.env.OPENQ_FRONTEND_REPO_ID;

	describe('verifyGithubOwnership', () => {
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

	describe.only('verifyUserCanAdministerRepository', () => {
		it('GithubClient.verifyUserCanAdministerRepository should return TRUE if the user can administer the repo', async () => {
			const result = await GithubClient.verifyUserCanAdministerRepository(req, repoId);
			expect(result).toEqual(true);
		});

		it('GithubClient.verifyUserCanAdministerRepository should return NO_GITHUB_OAUTH_TOKEN', async () => {
			try {
				await GithubClient.verifyUserCanAdministerRepository(req_NO_OAUTH_TOKEN, repoId);
				throw Error('should not reach here');
			} catch (error) {
				expect(error.type).toEqual('NO_GITHUB_OAUTH_TOKEN');
			}
		});
		
		it('GithubClient.verifyUserCanAdministerRepository should return INVALID_GITHUB_OAUTH_TOKEN if the user CANNOT administer the repo', async () => {
			const otherRepoId = 'MDEwOlJlcG9zaXRvcnk2MzQ2NTY2NA==';
			try {
				await GithubClient.verifyUserCanAdministerRepository(req, otherRepoId);
				throw Error('should not reach here');
			} catch (error) {
				expect(error.type).toEqual('INVALID_GITHUB_OAUTH_TOKEN');
			}
		});
	 });
});