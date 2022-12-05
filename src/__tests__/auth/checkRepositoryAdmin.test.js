const checkRepositoryAdmin = require('../../resolvers/utils/checkRepositoryAdmin');
const MockEmailClient = require('../../utils/auth/email/MockEmailClient');
const MockGithubClient = require('../../utils/auth/github/MockGithubClient');

describe('checkRepositoryAdmin', () => {
	beforeEach(() => {
		MockGithubClient.isValidGithub = true;
	});
	
	const id = '123';
	const email = process.env.EMAIL;
	const args_EMAIL = { email, id };
	const invalidArgs = { id };
	
	const req = null;

	it('should return viewerCanAdminister true', async () => {
		const result = await checkRepositoryAdmin(req, args_EMAIL, MockGithubClient);
		expect(result).toMatchObject({ error: false, errorMessage: null, viewerCanAdminister: true });
	});

	it('should return error if no email or github passed', async () => {
		const result = await checkRepositoryAdmin(req, invalidArgs, MockGithubClient);
		expect(result).toMatchObject({ error: true, errorMessage: 'Must provide an email' });
	});

	it('should return error if invalid auth - EMAIL', async () => {
		MockEmailClient.isValidEmail = false;
		const result = await checkRepositoryAdmin(req, invalidArgs, MockGithubClient);
		expect(result).toMatchObject({ error: true, errorMessage: 'Email not authorized' });
	});
}); 