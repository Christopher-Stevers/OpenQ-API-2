
const { getAuthenticatedClient, getAuthenticatedClientIntegration } = require('../utils/configureApolloClient');
const { GET_SUBMISSION, UPSERT_SUBMISSION, CREATE_NEW_REPOSITORY } = require('../utils/queries');

const { clearDb } = require('../utils/clearDb');

describe('upsertSubmission', () => {
	
	const repositoryId = 'repositoryId';
	const submissionId = 'submissionId';
	const blacklisted = true;
	const contractAddress = '0x0000000000000000000000000000000000000000';
	const organizationId = 'organizationId';

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
				variables: { address: contractAddress, organizationId, repositoryId }
			});
			await authenticatedClient.mutate({
				mutation: UPSERT_SUBMISSION,
				variables: { submissionId, repositoryId,  blacklisted }
			});


			const { data } = await authenticatedClient.query({
				query: GET_SUBMISSION,
				variables: { id: submissionId }
			});
			
			expect(data.submission).toMatchObject({
				users: [], blacklisted, __typename: 'Submission'
			});		
		});
	});

	describe('Unsuccessful', () => {
		afterEach(async () => {
			await clearDb();
		});
		it('should fail for unauthenticated calls', async () => {
        
			try {
				await authenticatedClient.mutate({
					mutation: CREATE_NEW_REPOSITORY,
					variables: { address: contractAddress, organizationId, repositoryId }
				});
				await unauthenticatedClient.mutate({
					mutation: UPSERT_SUBMISSION,
					variables: { submissionId, repositoryId,  blacklisted }
				});
				throw ('Should not reach this point');
			} catch (error) {
				// eslint-disable-next-line jest/no-conditional-expect
				expect(error.graphQLErrors[0].extensions.code).toEqual('UNAUTHENTICATED');
			}
		});
	});
});

