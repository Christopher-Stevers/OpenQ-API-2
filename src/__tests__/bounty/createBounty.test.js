
const { getAuthenticatedClient } = require('../utils/getClient');
const { CREATE_NEW_BOUNTY, GET_BOUNTY_BY_ID } = require('../queries');

// URL for connecting from OUTSIDE the docker-compose environment
// mongodb://root:root@localhost:27018/openqdb?authSource=admin

const dotenv = require('dotenv');
const clearDb = require('../utils/clearDb');
dotenv.config({ path: '../../../.env.test' });

describe('createBounty', () => {
	const contractAddress = '0x8daf17assdfdf20c9dba35f005b6324f493785d239719d';
	const authenticatedClient = getAuthenticatedClient('secret123!', 'signature');
	const unauthenticatedClient = getAuthenticatedClient('incorrect_secret', 'signature');

	it('Authenticated client can create bounty', async () => {
		await authenticatedClient.mutate({
			mutation: CREATE_NEW_BOUNTY,
			variables: { address: contractAddress, organizationId: 'mdp', bountyId: 'sdf', repositoryId: 'repoId', type: '1' }
		});

		const { data } = await authenticatedClient.query({
			query: GET_BOUNTY_BY_ID,
			variables: { contractAddress }
		});

		expect(data.bounty).toMatchObject({
			'tvl': 0,
			'bountyId': 'sdf',
			'type': '1',
			'organization': {
				'id': 'mdp'
			},
			'repository': {
				'id': 'repoId'
			}
		});

		await clearDb();
	});

	it('should fail for unauthenticated calls', async () => {
		try {
			await unauthenticatedClient.mutate({
				mutation: CREATE_NEW_BOUNTY,
				variables: { address: contractAddress, organizationId: 'mdp', bountyId: 'sdf', repositoryId: 'repoId', type: '1' }
			});
		} catch (error) {
			expect(error.graphQLErrors[0].extensions.code).toEqual('UNAUTHENTICATED');
		}
	});
});
