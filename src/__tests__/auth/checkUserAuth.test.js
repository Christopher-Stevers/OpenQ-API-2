const checkUserAuth = require('../../resolvers/utils/checkUserAuth');
const MockEmailClient = require('../../utils/auth/email/MockEmailClient');
const MockGithubClient = require('../../utils/auth/github/MockGithubClient');

describe('checkUserAuth', () => {
	beforeEach(() => {
		MockGithubClient.isValidGithub = true;
		MockEmailClient.isValidEmail = true;
	});
	
	const id = '123';
	const github = process.env.GITHUB_USER_LOGIN;
	const email = process.env.EMAIL;
	const otherEmail = process.env.OTHER_EMAIL;
	
	const args_GITHUB = { github, id };
	const args_EMAIL = { email, id };
	const args_BOTH = { email, github, id };
	
	const invalidArgs = { id };

	const prisma = {
		user: {
			findUnique: async () => {
				return new Promise(async (resolve) => {
					resolve({ id });
				});
			},
		}
	};
	
	const req = null;

	it('should return error if no email or github passed', async () => {
		const result = await checkUserAuth(prisma, req, invalidArgs, MockEmailClient, MockGithubClient);
		expect(result).toMatchObject({ error: true, errorMessage: 'Must provide a an email OR github' });
	});

	it('should return error if invalid auth - EMAIL', async () => {
		MockEmailClient.isValidEmail = false;
		const result = await checkUserAuth(prisma, req, args_EMAIL, MockEmailClient, MockGithubClient);
		expect(result).toMatchObject({ error: true, errorMessage: 'Email not authorized' });
	});

	it('should return error if invalid auth - GITHUB', async () => {
		MockGithubClient.isValidGithub = false;
		const result = await checkUserAuth(prisma, req, args_GITHUB, MockEmailClient, MockGithubClient);
		expect(result).toMatchObject({ error: true, errorMessage: 'Github not authorized' });
	});

	it('should return error false and identifier if successful - GITHUB', async () => {
		const result = await checkUserAuth(prisma, req, args_GITHUB, MockEmailClient, MockGithubClient);
		expect(result).toMatchObject({ error: false, errorMessage: null, id, username: github });
	});

	it('should return error false and identifier if successful - EMAIL', async () => {
		const result = await checkUserAuth(prisma, req, args_EMAIL, MockEmailClient, MockGithubClient);
		expect(result).toMatchObject({ error: false, errorMessage: null, id });
	});

	it('should return error false and identifier if successful - BOTH GITHUB and EMAIL', async () => {
		const result = await checkUserAuth(prisma, req, args_BOTH, MockEmailClient, MockGithubClient);
		expect(result).toMatchObject({ error: false, errorMessage: null, id });
	});
}); 