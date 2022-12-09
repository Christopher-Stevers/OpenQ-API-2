
const { getAuthenticatedClient, getAuthenticatedClientIntegration } = require('../utils/configureApolloClient');
const { GET_PR, UPSERT_PR } = require('../utils/queries');

const { clearDb } = require('../utils/clearDb');

describe('upsertPr', () => {
	
	const github = process.env.GITHUB_USER_ID;
	const prId = 'prId';
	const blacklisted = true;

	let authenticatedClient;
	let unauthenticatedClient;

	if (process.env.DEPLOY_ENV === 'production') {
		authenticatedClient = getAuthenticatedClientIntegration(process.env.OPENQ_API_SECRET, process.env.GITHUB_OAUTH_TOKEN, process.env.EMAIL_OAUTH);
		unauthenticatedClient = getAuthenticatedClientIntegration('incorrect_secret', 'invalid_oauth_token', 'invalid_email_oauth');
	} else {
		authenticatedClient = getAuthenticatedClient(process.env.OPENQ_API_SECRET, true, true);
		unauthenticatedClient = getAuthenticatedClient('incorrect_secret', 'signature', false, false);
	}

	describe('Successful', () => {
		afterEach(async () => {
			await clearDb();
		});

		it('Authenticated client can add user to repository', async () => {
			await authenticatedClient.mutate({
				mutation: UPSERT_PR,
				variables: { prId, blacklisted, github }
			});

			const { data } = await authenticatedClient.query({
				query: GET_PR,
				variables: { prId }
			});
			
			expect(data.pr).toMatchObject({
				contributors: [], __typename: 'PR'
			});
		});
	});

	describe('Unsuccessful', () => {
		it('should fail for unauthenticated calls', async () => {
			try {
				await unauthenticatedClient.mutate({
					mutation: UPSERT_PR,
					variables: { prId, blacklisted }
				});
				throw ('Should not reach this point');
			} catch (error) {
				// eslint-disable-next-line jest/no-conditional-expect
				expect(error.graphQLErrors[0].extensions.code).toEqual('UNAUTHENTICATED');
			}
		});
	});
});

