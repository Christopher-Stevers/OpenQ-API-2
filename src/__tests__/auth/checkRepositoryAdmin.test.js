const checkRepositoryAdmin = require('../../resolvers/utils/checkRepositoryAdmin');
const MockGithubClient = require('../../utils/auth/github/MockGithubClient');

describe('checkRepositoryAdmin', () => {
	beforeEach(() => {
		MockGithubClient.isValidGithub = true;
	});
	
	const repositoryId = '123';
	const args = { repositoryId };
	
	const req = null;

	it('should return true if can admin', async () => {
		const result = await checkRepositoryAdmin(req, args, MockGithubClient);
		expect(result).toMatchObject({ error: false, errorMessage: null, viewerCanAdminister: true });
	});

	it('should return error if github is not admin', async () => {
		MockGithubClient.isValidGithub = false;
		const result = await checkRepositoryAdmin(req, args, MockGithubClient);
		expect(result).toMatchObject({ error: true, errorMessage: `Github not authorized to administer repository with id ${args.repositoryId}`, viewerCanAdminister: false });
	});
}); 