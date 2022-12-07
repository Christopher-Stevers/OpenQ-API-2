
const { getAuthenticatedClient, getAuthenticatedClientIntegration } = require('../utils/configureApolloClient');
const { CREATE_NEW_REPOSITORY, GET_REPOSITORY } = require('../utils/queries');

const { clearDb } = require('../utils/clearDb');

describe('createRepository', () => {
	const contractAddress = '0x8daf17assdfdf20c9dba35f005b6324f493785d239719d';
	const organizationId = 'organizationId';
	const repositoryId = 'repositoryId';

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
		it('Authenticated client can create repository', async () => {

			await authenticatedClient.mutate({
				mutation: CREATE_NEW_REPOSITORY,
				variables: { address: contractAddress, organizationId, repositoryId }
			});

			const { data } = await authenticatedClient.query({
				query: GET_REPOSITORY,
				variables: { id: repositoryId }
			});

			expect(data.repository).toMatchObject({
				id: 'repositoryId',
				organization: { id: 'organizationId', __typename: 'Organization' },
				__typename: 'Repository'
			});

		});
	});
	describe('Unsuccessful', () => {
		it('should fail for unauthenticated calls', async () => {
			try {
				await unauthenticatedClient.mutate({
					mutation: CREATE_NEW_REPOSITORY,
					variables: { address: contractAddress, organizationId, repositoryId }
				});
				throw ('Should not reach this point');
			} catch (error) {
				// eslint-disable-next-line jest/no-conditional-expect
				expect(error.graphQLErrors[0].extensions.code).toEqual('UNAUTHENTICATED');
			}
		});
	});
});

