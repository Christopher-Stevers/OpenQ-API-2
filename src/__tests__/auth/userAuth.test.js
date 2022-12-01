const checkUserAuth = require('../../resolvers/utils/userAuth');
const MockEmailClient = require('../../utils/auth/email/MockEmailClient');
const MockGithubClient = require('../../utils/auth/github/MockGithubClient');

describe('userAuth', () => {
	beforeEach(() => {
		MockGithubClient.isValidGithub = true;
		MockEmailClient.isValidEmail = true;
	});
	
	const userId = '123';
	const github = 'github';
	const email = 'email';
	const args = { email, github, userId };
	const invalidArgs = { userId };

	const prisma = {};
	
	const req = null;

	it('should throw Error if no email or github passed', async () => {
		const result = await checkUserAuth(prisma, req, invalidArgs, MockEmailClient, MockGithubClient);
		expect(result).toMatchObject({ error: true, errorMessage: 'Must provide a an email OR github' });
	});

	it('should return error false and identifier if successful - GITHUB', async () => {
		const result = await checkUserAuth(prisma, req, args, MockEmailClient, MockGithubClient);
		console.log(result);
		expect(result).toMatchObject({ error: false, errorMessage: null, github: 'github' });
	});
}); 