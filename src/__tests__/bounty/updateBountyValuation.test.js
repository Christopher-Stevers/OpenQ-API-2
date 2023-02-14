
const { getAuthenticatedClient, getAuthenticatedClientIntegration } = require('../utils/configureApolloClient');
const { CREATE_NEW_BOUNTY, GET_BOUNTY_BY_ID, UPDATE_BOUNTY_VALUATION, UPSERT_USER } = require('../utils/queries');

const { clearDb } = require('../utils/clearDb');

describe('createBounty', () => {
	const contractAddress = '0x8daf17assdfdf20c9dba35f005b6324f493785d239719d';
	const organizationId = 'organizationId';
	const bountyId = 'bountyId';
	const repositoryId = 'repositoryId';
	const type = '1';

	let authenticatedClient;
	let unauthenticatedClient;
	let authenticatedClientGithub;

	if(process.env.DEPLOY_ENV === 'production') {
		authenticatedClient = getAuthenticatedClientIntegration(process.env.OPENQ_API_SECRET, process.env.GITHUB_OAUTH_TOKEN, process.env.EMAIL_DID_TOKEN);
		authenticatedClientGithub = getAuthenticatedClient(null, process.env.GITHUB_OAUTH_TOKEN, process.env.EMAIL_DID_TOKEN);

		unauthenticatedClient = getAuthenticatedClientIntegration('incorrect_secret', 'invalid_oauth_token', 'invalid_email_oauth');
	} else  {
		authenticatedClient = getAuthenticatedClient(process.env.OPENQ_API_SECRET, true, true);
		authenticatedClientGithub = getAuthenticatedClient(null,true, true);

		unauthenticatedClient  = getAuthenticatedClient('incorrect_secret', 'signature', false, false);
	}

	describe('Successful', () => {
		afterEach(async () => {
			await clearDb();
		});

		it('Authenticated client can create bounty', async () => {
			const github = process.env.GITHUB_USER_ID;
			const user = await authenticatedClientGithub.mutate({
				mutation: UPSERT_USER,
				variables: { github }
			});
			const creatingUserId = user.data.upsertUser.id;
			await authenticatedClient.mutate({
				mutation: CREATE_NEW_BOUNTY,
				variables: { address: contractAddress, organizationId, bountyId, repositoryId, type, creatingUserId }
			});
			
			await authenticatedClient.mutate({
				mutation: UPDATE_BOUNTY_VALUATION,
				variables: { address: contractAddress, tvl: 1, tvc: 2 }
			});
	
			const { data } = await authenticatedClient.query({
				query: GET_BOUNTY_BY_ID,
				variables: { contractAddress }
			});
	
			expect(data.bounty).toMatchObject({
				'tvl': 1,
				'tvc': 2,
				'bountyId': bountyId,
				'type': type,
				'blacklisted': false,
				'organization': {
					'id': organizationId
				},
				'repository': {
					'id': repositoryId
				}
			});
		});
	});

	describe('Unsuccessful', () => {
		it('should fail for unauthenticated calls', async () => {
			try {
				await unauthenticatedClient.mutate({
					mutation: CREATE_NEW_BOUNTY,
					variables: { address: contractAddress, organizationId, bountyId, repositoryId, type }
				});
				throw('Should not reach this point');
			} catch (error) {
				expect(error.graphQLErrors[0].extensions.code).toEqual('UNAUTHENTICATED');
			}
		});
	 });
});
