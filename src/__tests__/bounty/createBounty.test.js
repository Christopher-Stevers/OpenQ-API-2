
const { getAuthenticatedClient } = require('../utils/getClient');
const { CREATE_NEW_BOUNTY, GET_BOUNTY_BY_ID } = require('../utils/queries');

// URL for connecting from OUTSIDE the docker-compose environment
// mongodb://root:root@localhost:27018/openqdb?authSource=admin

const dotenv = require('dotenv');
const { clearDb } = require('../utils/clearDb');
dotenv.config({ path: '../../../.env.test' });

describe('createBounty', () => {
	const contractAddress = '0x8daf17assdfdf20c9dba35f005b6324f493785d239719d';
	const organizationId = 'organizationId';
	const bountyId = 'bountyId';
	const repositoryId = 'repositoryId';
	const type = '1';

	const authenticatedClient = getAuthenticatedClient('secret123!', 'signature');
	const unauthenticatedClient = getAuthenticatedClient('incorrect_secret', 'signature');

	describe('Successful', () => {
		afterEach(async () => {
			await clearDb();
		});

		it('Authenticated client can create bounty', async () => {
			await authenticatedClient.mutate({
				mutation: CREATE_NEW_BOUNTY,
				variables: { address: contractAddress, organizationId, bountyId, repositoryId, type }
			});
	
			const { data } = await authenticatedClient.query({
				query: GET_BOUNTY_BY_ID,
				variables: { contractAddress }
			});
	
			expect(data.bounty).toMatchObject({
				'tvl': 0,
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
