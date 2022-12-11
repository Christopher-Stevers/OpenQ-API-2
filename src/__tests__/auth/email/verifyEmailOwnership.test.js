const verifyEmailOwnership = require('../../../utils/auth/email/verifyEmailOwnership');
const MockMagicLinkClient = require('../../../utils/auth/email/MockMagicLinkClient');

describe('verifyEmailOwnership', () => { 
	let magic;

	beforeEach(() => {
		magic = new MockMagicLinkClient();
	});

	const req = {
		headers: {
			cookie: `email_auth=${process.env.EMAIL_DID_TOKEN}`,
		}
	};

	const email = process.env.EMAIL;

	describe('Success', () => {
		it('should return true if the user is the owner of the token and email', async () => {
			try {
				const result = await verifyEmailOwnership(req, email, magic);
				expect(result).toBe(true);
			} catch(error) {
				throw new Error(`Test failed: ${error}`);
			}
		});
	});

	describe('Errors', () => {
		it('INVALID_TOKEN', async () => {
			const reqWithNoCookie = {
				headers: {
					cookie: 'foo=bar'
				}
			};

			await expect(verifyEmailOwnership(reqWithNoCookie, email, magic)).rejects.toEqual('verifyEmailOwnership failed to extract cookie');
		});

		it('DID TOKEN INVALID', async () => {
			magic.setIsValidToken(false);
			await expect(verifyEmailOwnership(req, email, magic)).rejects.toEqual('Invalid DID Token');
		});

		it('DID TOKEN VALID FOR DIFFERENT EMAIL', async () => {
			magic.setIsViewersEmail(false);
			await expect(verifyEmailOwnership(req, email, magic)).rejects.toEqual('Email ownership verification failed');
		});
	});
});