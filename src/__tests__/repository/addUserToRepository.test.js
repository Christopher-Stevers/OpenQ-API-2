
const { getAuthenticatedClient, getAuthenticatedClientIntegration } = require('../utils/configureApolloClient');
const { ADD_USER_TO_REPOSITORY, GET_REPOSITORY, CREATE_USER, CREATE_NEW_REPOSITORY } = require('../utils/queries');

const { clearDb } = require('../utils/clearDb');

describe('addUserFromSubmission', () => {
	const organizationId = 'organizationId';
	const repositoryId = 'repositoryId';
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
		it('Authenticated client can add user to repository', async () => {


			await authenticatedClient.mutate({
				mutation: CREATE_NEW_REPOSITORY,
				variables: { organizationId, repositoryId }
			});

			const user = await authenticatedClient.mutate({
				mutation: CREATE_USER,
				variables: { github }
			});

			const userId = user.data.upsertUser.id;

			await authenticatedClient.mutate({
				mutation: ADD_USER_TO_REPOSITORY,
				variables: { userId, repositoryId }
			});

			const { data } = await authenticatedClient.query({
				query: GET_REPOSITORY,
				variables: { id: repositoryId }
			});

			expect(data.repository).toMatchObject({
				id: 'repositoryId',
				participants: [{ id: userId, __typename: 'User', }],
				__typename: 'Repository'
			});

		});
	});
	describe('Unsuccessful', () => {
		it('should fail for unauthenticated calls', async () => {
			try {

				const user = await authenticatedClient.mutate({
					mutation: CREATE_USER,
					variables: { github }
				});

				const userId = user.data.upsertUser.id;
				await unauthenticatedClient.mutate({
					mutation: ADD_USER_TO_REPOSITORY,
					variables: { userId, repositoryId }
				});
				throw ('Should not reach this point');
			} catch (error) {
				// eslint-disable-next-line jest/no-conditional-expect
				expect(error.graphQLErrors[0].extensions.code).toEqual('UNAUTHENTICATED');
			}
		});
	});
});

