
const { getAuthenticatedClient, getAuthenticatedClientIntegration } = require('../utils/configureApolloClient');
const { GET_PR, ADD_CONTRIBUTOR, UPSERT_USER } = require('../utils/queries');

const { clearDb } = require('../utils/clearDb');

describe('addContributor', () => {
	const prId = 'prId';
	const blacklisted = true;
	const github = process.env.GITHUB_USER_ID;

	let authenticatedClient;
	let unauthenticatedClient;

	if (process.env.DEPLOY_ENV === 'production') {
		authenticatedClient = getAuthenticatedClientIntegration(process.env.OPENQ_API_SECRET, process.env.GITHUB_OAUTH_TOKEN, process.env.EMAIL_DID_TOKEN);
		unauthenticatedClient = getAuthenticatedClientIntegration('incorrect_secret', 'invalid_oauth_token', 'invalid_email_oauth');
	} else {
		authenticatedClient = getAuthenticatedClient(process.env.OPENQ_API_SECRET, true, true);
		unauthenticatedClient = getAuthenticatedClient('incorrect_secret', 'signature', false, false);
	}

	describe('Successful', () => {
		afterEach(async () => {
			await clearDb();
		});

		it.only('Authenticated client can add user to repository', async () => {
			const user = await authenticatedClient.mutate({
				mutation: UPSERT_USER,
				variables: { github }
			});

			const userId = user.data.upsertUser.id;
			
			await authenticatedClient.mutate({
				mutation: ADD_CONTRIBUTOR,
				variables: { prId, repositoryId, blacklisted, userId }
			});

			const { data } = await authenticatedClient.query({
				query: GET_PR,
				variables: { prId }
			});

			expect(data).toMatchObject({
				pr: {
					contributors: [
						{
							userId: userId
						}
					]
				}
			});
		});
	});
	describe('Unsuccessful', () => {
		it('should fail for unauthenticated calls', async () => {
			try {
				await unauthenticatedClient.mutate({
					mutation: ADD_CONTRIBUTOR,
					variables: { prId, blacklisted, userId: github }
				});
				throw ('Should not reach this point');
			} catch (error) {
				// eslint-disable-next-line jest/no-conditional-expect
				expect(error.graphQLErrors[0].extensions.code).toEqual('UNAUTHENTICATED');
			}
		});
	});
});

