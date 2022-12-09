const checkRepositoryAdmin = require('../../resolvers/utils/checkRepositoryAdmin');
const MockGithubClient = require('../../utils/auth/github/MockGithubClient');

describe('checkRepositoryAdmin', () => {
	beforeEach(() => {
		MockGithubClient.isValidGithub = true;
	});
	
	const id = '123';
	const github = process.env.GITHUB_USER_ID;
	const args_EMAIL = { github, id };
	const invalidArgs = { id };
	
	const req = null;

	it('should return viewerCanAdminister true', async () => {
		const result = await checkRepositoryAdmin(req, args_EMAIL, MockGithubClient);
		expect(result).toMatchObject({ error: false, errorMessage: null, viewerCanAdminister: true });
	});

	it('should return error if no email or github passed', async () => {
		const result = await checkRepositoryAdmin(req, invalidArgs, MockGithubClient);
		expect(result).toMatchObject({ error: true, errorMessage: 'Must provide a github' });
	});
}); 