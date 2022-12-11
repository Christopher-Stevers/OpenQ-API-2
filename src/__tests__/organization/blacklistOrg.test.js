
const { getAuthenticatedClient, getAuthenticatedClientIntegration } = require('../utils/configureApolloClient');
const { BLACKLIST_ORGANIZATION, GET_ORGANIZATION } = require('../utils/queries');

const { clearDb } = require('../utils/clearDb');

describe('blacklistOrg', () => {
	const organizationId = 'organizationId';

	let authenticatedClient;
	let unauthenticatedClient;

	if (process.env.DEPLOY_ENV === 'production') {
		// For blacklisting, we need the BANHAMMER secret rather than the OPENQ_API_SECRET
		authenticatedClient = getAuthenticatedClientIntegration(process.env.BANHAMMER, process.env.GITHUB_OAUTH_TOKEN, process.env.EMAIL_DID_TOKEN);
		unauthenticatedClient = getAuthenticatedClientIntegration('incorrect_secret', 'invalid_oauth_token', 'invalid_email_oauth');
	} else {
		authenticatedClient = getAuthenticatedClient(process.env.BANHAMMER, true, true);
		unauthenticatedClient = getAuthenticatedClient('incorrect_secret', 'signature', false, false);
	}

	describe('Successful', () => {
		afterEach(async () => {
			await clearDb();
		});

		it('Authenticated client can blacklist an organization', async () => {

			// ARRANGE
			await authenticatedClient.mutate({
				mutation: BLACKLIST_ORGANIZATION,
				variables: { organizationId, blacklist: true }
			});

			const { data } = await authenticatedClient.query({
				query: GET_ORGANIZATION,
				variables: { organizationId }
			});
			// ASSERT
			expect(data.organization).toMatchObject({
				id: organizationId,
				blacklisted: true
			});

			// ACT
			await authenticatedClient.mutate({
				mutation: BLACKLIST_ORGANIZATION,
				variables: { organizationId, blacklist: false }
			});

			// ASSERT
			const newOrgResult = await authenticatedClient.query({
				query: GET_ORGANIZATION,
				variables: { organizationId }
			});

			expect(newOrgResult.data.organization).toMatchObject({
				id: organizationId,
				blacklisted: false
			});

		});
	});

	describe('Unsuccessful', () => {
		it('should fail for unauthenticated calls', async () => {
			try {
				await unauthenticatedClient.mutate({
					mutation: BLACKLIST_ORGANIZATION,
					variables: { organizationId }
				});
				throw ('Should not reach this point');
			} catch (error) {
				expect(error.graphQLErrors[0].extensions.code).toEqual('UNAUTHENTICATED');
			}
		});
	});
});
