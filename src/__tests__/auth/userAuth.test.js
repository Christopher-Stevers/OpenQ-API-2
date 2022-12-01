const checkUserAuth = require('../../resolvers/utils/userAuth');
const MockEmailClient = require('../../utils/auth/email/MockEmailClient');
const MockGithubClient = require('../../utils/auth/github/MockGithubClient');

describe('userAuth', () => {
	const userId = '123';
	const github = 'github';
	const email = 'email';
	const args = { email, github, userId };

	const prisma = {};
	
	const req = {};

	it('should return a function', async () => {
		MockGithubClient.isValidGithub = true;
		MockEmailClient.isValidEmail = true;
		const result = await checkUserAuth(prisma, req, args, MockEmailClient, MockGithubClient);
		console.log(result);
		expect(result).toMatchObject({ github: 'github' });
	});
}); 