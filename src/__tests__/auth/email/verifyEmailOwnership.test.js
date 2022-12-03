const verifyEmailOwnership = require('../../../utils/auth/email/verifyEmailOwnership');
const MockMagicLinkClient = require('../../../utils/auth/email/MockMagicLinkClient');

describe('verifyEmailOwnership', () => { 
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

	const email = process.env.EMAIL;

	describe('Success', () => {
		it('should return true if the user is the owner of the token', async () => {
			MockMagicLinkClient.isValidToken = true;
			const result = await verifyEmailOwnership(req, email, MockMagicLinkClient);
			expect(result).toBe(true);
		});
	});

	describe('Errors', () => {
		it('INVALID_TOKEN', async () => {
			const reqWithNoCookie = {
				headers: {
					cookie: 'foo=bar'
				}
			};

			await expect(verifyEmailOwnership(reqWithNoCookie, email, MockMagicLinkClient)).rejects.toEqual('No email_auth cookie found');
		});

		it('DID TOKEN INVALID', async () => {
			MockMagicLinkClient.isValidToken = false;
			await expect(verifyEmailOwnership(req, email, MockMagicLinkClient)).resolves.toEqual(false);
		});
	});
});