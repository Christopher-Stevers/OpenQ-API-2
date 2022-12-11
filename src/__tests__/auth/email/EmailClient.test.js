const EmailClient = require('../../../utils/auth/email/EmailClient');
const MockMagicLinkClient = require('../../../utils/auth/email/MockMagicLinkClient');

describe('EmailClient', () => {
	let emailClient;

	beforeEach(() => {
		const magic = new MockMagicLinkClient();
		emailClient = new EmailClient(magic);
	});

	const req = {
		headers: {
			cookie: `email_auth=${process.env.EMAIL_DID_TOKEN}`,
		}
	};

	const email = process.env.EMAIL;

	it('EmailClient.verifyEmail should return TRUE if the DID Token matches the given email', async () => {
		const result = await emailClient.verifyEmail(req, email);
		expect(result).toEqual(true);
	});

	it('EmailClient.verifyEmail should return FALSE if the DID Token is invalid', async () => {
		const magic = new MockMagicLinkClient();
		magic.setIsValidToken(false);
		emailClient = new EmailClient(magic);

		await expect(emailClient.verifyEmail(req, email)).rejects.toEqual('Invalid DID Token');
	});

	it('EmailClient.verifyEmail should return FALSE if the DID Token is Valid but does not match email', async () => {
		const magic = new MockMagicLinkClient();
		magic.setIsViewersEmail(false);
		emailClient = new EmailClient(magic);

		await expect(emailClient.verifyEmail(req, email)).rejects.toEqual('Email ownership verification failed');
	});

	it('EmailClient.verifyEmail should return FALSE if there is no email_auth token', async () => {
		const reqWithNoCookie = {
			headers: {
				cookie: 'foo=bar'
			}
		};

		await expect(emailClient.verifyEmail(reqWithNoCookie, email)).rejects.toEqual('verifyEmailOwnership failed to extract cookie');
	});
});