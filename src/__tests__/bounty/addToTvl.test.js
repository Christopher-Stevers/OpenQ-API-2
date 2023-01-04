// test addToTvl resolver


const { getAuthenticatedClient, getAuthenticatedClientIntegration } = require('../utils/configureApolloClient');
const { CREATE_NEW_BOUNTY, GET_BOUNTY_BY_ID, ADD_TO_BOUNTY } = require('../utils/queries');

const { clearDb } = require('../utils/clearDb');

describe('createBounty', () => {
	const address = '0x8daf17assdfdf20c9dba35f005b6324f493785d239719d';
	const zeroAddress = '0x0000000000000000000000000000000000000000';
	const tokenBalance = {
		tokenAddress: zeroAddress,
		volume: '3000000000000000000',
	};
	const add = true;
	const organizationId = 'organizationId';
	const bountyId = 'bountyId';
	const repositoryId = 'repositoryId';
	const type = '1';

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

		it('Authenticated client can create bounty', async () => {
			await authenticatedClient.mutate({
				mutation: CREATE_NEW_BOUNTY,
				variables: { address, organizationId, bountyId, repositoryId, type }
			});
			await authenticatedClient.mutate({
				mutation: ADD_TO_BOUNTY,
				variables: {
					address,
					tokenBalance,
					add,
				},
			});
            

			const { data } = await authenticatedClient.query({
				query: GET_BOUNTY_BY_ID,
				variables: { contractAddress: address }
			});

			expect(data.bounty).toMatchObject({
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
					mutation: ADD_TO_BOUNTY,
					variables: {
						address,
						tokenBalance,
						add,
					},
				});
				throw ('Should not reach this point');
			} catch (error) {
				// eslint-disable-next-line jest/no-conditional-expect
				expect(error.graphQLErrors[0].extensions.code).toEqual('UNAUTHENTICATED');
			}
		});
	});
});


