
const { getAuthenticatedClient, getClient } = require('../utils/getClient');
const { CREATE_NEW_BOUNTY, GET_BOUNTY_BY_HASH } = require('../queries');
beforeEach(async () => {
	jest.setTimeout(100000);
	const { PrismaClient } = require('../../../generated/client');

	const prisma = new PrismaClient();
	await prisma.bounty.deleteMany({});
});




describe('Authenticated Client can create bounties.', () => {
	const client = getClient();

	it('Should watch and unwatch when signed user attempts.', async () => {


		const autoTaskClient = getAuthenticatedClient('secret123!');
		const contractAddress = '0x8daf17a20c9dba35f005b6324f493785d239719d';
		await autoTaskClient.mutate({
			mutation: CREATE_NEW_BOUNTY,
			variables: { address: contractAddress, organizationId: 'mdp', bountyId: 'sdf' }
		});
		const { data } = await client.query({

			query: GET_BOUNTY_BY_HASH,
			variables: { contractAddress }
		});
		expect(data.bounty).toMatchObject({
			tvl: 0,
			bountyId: 'sdf',
			watchingUserIds: []
		});

	});
});

describe('Not authenticated client cannot create bounties.', () => {
	const client = getClient();

	it('Should watch and unwatch when signed user attempts.', async () => {


		const contractAddress = '0x8daf17a20c9dba35f005b6324f493785d239719d';
		const createBounty = async () => {
			return client.mutate({
				mutation: CREATE_NEW_BOUNTY,
				variables: { address: contractAddress, organizationId: 'mdp', bountyId: 'sdf' }
			});
		};
		await expect(createBounty()).rejects.toThrow(Error);
		const { data } = await client.query({

			query: GET_BOUNTY_BY_HASH,
			variables: { contractAddress }
		});
		expect(data.bounty).toBe(null);

	});
});
