const EmailClient = require('../../../utils/auth/email/EmailClient');
const MockMagicLinkClient = require('../../../utils/auth/email/MockMagicLinkClient');

describe('EmailClient', () => {
	let emailClient;

	beforeEach(() => {
		MockMagicLinkClient.isValidToken = true;
		emailClient = new EmailClient(MockMagicLinkClient);
	});

	const req = {
		headers: {
			cookie: `email_auth=${process.env.EMAIL_DID_TOKEN}`,
		}
	};

	const req_NO_OAUTH_TOKEN = {
		headers: {
			cookie: 'foo=bar',
		}
	};

	const userId = process.env.GITHUB_USER_ID;
	const otherUserId = process.env.OTHER_GITHUB_USER_ID;

	it('EmailClient.verifyEmail should return TRUE if the OAuth Token matches the given email', async () => {
		const result = await emailClient.verifyEmail(req, userId);
		expect(result).toEqual(true);
	});

	it.only('EmailClient.verifyEmail should return FALSE if the OAuth Token is invalid', async () => {
		MockMagicLinkClient.isValidToken = false;
		emailClient = new EmailClient(MockMagicLinkClient);

		const result = await emailClient.verifyEmail(req, userId);
		expect(result).toEqual(false);
	});
});