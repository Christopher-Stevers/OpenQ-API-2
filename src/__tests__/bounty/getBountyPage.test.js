
const { CREATE_NEW_BOUNTY, GET_BOUNTY_PAGE } = require('../queries');
const { getAuthenticatedClient, getClient } = require('../utils/getClient');
const autoTaskClient = getAuthenticatedClient('secret123!');
beforeEach(async () => {
	jest.setTimeout(100000);
	const { PrismaClient } = require('../../../generated/client');

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
	const orders = ['asc', 'desc'];
	const fields = ['tvl', 'address'];
	const test = (sortOrder, field) => {

		it('Should watch and unwatch when signed user attempts.', async () => {
			const getPage = async (after) => {

				const { data } = await client.query({

					query: GET_BOUNTY_PAGE,
					variables: { limit: 5, sortOrder, orderBy: field, after }
				});
				return data;
			};
			const firstPage = await getPage();
			expect(firstPage.bountiesConnection.bounties.length).toBe(5);
			console.log(field, sortOrder);
			console.log(firstPage.bountiesConnection.bounties.map(bounty => bounty.address));
			const secondPage = await getPage(firstPage.bountiesConnection.cursor);
			expect(secondPage.bountiesConnection.bounties.length).toBe(5);
			console.log(secondPage.bountiesConnection.bounties.map(bounty => bounty.address));
			const thirdPage = await getPage(secondPage.bountiesConnection.cursor);
			console.log(thirdPage.bountiesConnection.bounties.map(bounty => bounty.address));
			expect(thirdPage.bountiesConnection.bounties.length).toBe(2);

		});
	};
	orders.forEach(order => fields.forEach(field => test(order, field)));


});

