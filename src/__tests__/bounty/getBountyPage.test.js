
const { CREATE_NEW_BOUNTY, GET_BOUNTY_PAGE } = require('../queries');
const { getAuthenticatedClient, getClient } = require('../utils/getClient');
const autoTaskClient = getAuthenticatedClient('secret123!');
beforeEach(async () => {
	jest.setTimeout(100000);
	const { PrismaClient } = require('@prisma/client');

	const prisma = new PrismaClient();
	await prisma.bounty.deleteMany({});
	const createBounty = async (contractAddress) => {
		await autoTaskClient.mutate({
			mutation: CREATE_NEW_BOUNTY,
			variables: { address: contractAddress, organizationId: 'mdp', bountyId: 'sdf' }
		});
	};

	for (let i = 0; i < 12; i++) {
		await createBounty(i.toString());

	}
});




describe('Get Paginated Bounties.', () => {
	const client = getClient();
	const test = (sortOrder) => {

		it('Should watch and unwatch when signed user attempts.', async () => {
			const getPage = async (after) => {

				const { data } = await client.query({

					query: GET_BOUNTY_PAGE,
					variables: { limit: 5, sortOrder, orderBy: 'address', after }
				});
				return data;
			};
			const firstPage = await getPage();
			expect(firstPage.bountiesConnection.bounties.length).toBe(5);
			const secondPage = await getPage(firstPage.bountiesConnection.cursor);
			expect(secondPage.bountiesConnection.bounties.length).toBe(5);
			const thirdPage = await getPage(secondPage.bountiesConnection.cursor);
			expect(thirdPage.bountiesConnection.bounties.length).toBe(2);

		});
	};
	['asc', 'desc'].forEach(order => test(order));


});

