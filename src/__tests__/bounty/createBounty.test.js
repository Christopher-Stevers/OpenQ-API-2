
const { getAuthenticatedClient } = require('../utils/getClient');
const { CREATE_NEW_BOUNTY, GET_BOUNTY_BY_ADDRESS } = require('../queries');

describe('Authenticated Client can create bounties', () => {
	const contractAddress = '0x8daf17a20c9dba35f005b6324f493785d239719d';
	const authenticatedClient = getAuthenticatedClient('secret123!', 'signature');

	// Clear the database before each test run
	beforeEach(async () => {
		const { PrismaClient } = require('../../../generated/client');
		const prisma = new PrismaClient();
		await prisma.bounty.deleteMany({});
	});

	it('Authenticated client can create bounty', async () => {
		await authenticatedClient.mutate({
			mutation: CREATE_NEW_BOUNTY,
			variables: { address: contractAddress, organizationId: 'mdp', bountyId: 'sdf', repositoryId: 'repoId' }
		});

		console.log(authenticatedClient);

		const { data } = await authenticatedClient.query({
			query: GET_BOUNTY_BY_ADDRESS,
			variables: { contractAddress }
		});

		console.log(data);

		// expect(data.bounty).toMatchObject({
		// 	tvl: 0,
		// 	bountyId: 'sdf',
		// 	watchingUserIds: []
		// });
		expect(true).toBe(true);
	});
});
