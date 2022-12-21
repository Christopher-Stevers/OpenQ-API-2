
const { getAuthenticatedClient, getAuthenticatedClientIntegration } = require('../utils/configureApolloClient');
const { GET_SUBMISSION, ADD_USER_TO_SUBMISSION, CREATE_NEW_REPOSITORY, UPSERT_USER } = require('../utils/queries');

const { clearDb } = require('../utils/clearDb');

describe('addContributor', () => {
	const submissionId = 'submissionId';
	const repositoryId = 'repositoryId';
	const organizationId = 'organizationId';
    
	const blacklisted = true;
	const github = process.env.GITHUB_USER_ID;
	const userId = 'userId';

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

		// eslint-disable-next-line jest/no-focused-tests
		it.only('Authenticated client can add user to repository', async () => {
			const user = await authenticatedClient.mutate({
				mutation: UPSERT_USER,
				variables: { github }
			});

			const userId = user.data.upsertUser.id;
			await authenticatedClient.mutate({
				mutation: CREATE_NEW_REPOSITORY,
				variables: { organizationId, repositoryId }
			});
			await authenticatedClient.mutate({
				mutation: ADD_USER_TO_SUBMISSION,
				variables: { submissionId, blacklisted, userId, repositoryId }
			});


			const { data } = await authenticatedClient.query({
				query: GET_SUBMISSION,
				variables: { id: submissionId }
			});
			expect(data).toMatchObject({
				submission: {
					users: [
						{
							id: userId
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
					mutation: ADD_USER_TO_SUBMISSION,
					variables: { submissionId, blacklisted, userId, repositoryId }
				});

				throw ('Should not reach this point');
			} catch (error) {
				// eslint-disable-next-line jest/no-conditional-expect
				expect(error.graphQLErrors[0].extensions.code).toEqual('UNAUTHENTICATED');
			}
		});
	});
});

