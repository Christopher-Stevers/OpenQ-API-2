
const { getAuthenticatedClient } = require('../utils/configureApolloClient');
const { WATCH_BOUNTY, CREATE_NEW_BOUNTY, CREATE_USER, GET_USER, GET_BOUNTY_BY_ID, UNWATCH_BOUNTY } = require('../utils/queries');

const { clearDb } = require('../utils/clearDb');

describe('unwatchBounty', () => {
	const contractAddress = '0x8daf17assdfdf20c9dba35f005b6324f493785d239719d';
	const organizationId = 'organizationId';
	const bountyId = 'bountyId';
	const repositoryId = 'repositoryId';
	const type = '1';

	const github = '1234';

	const authenticatedClient = getAuthenticatedClient(process.env.OPENQ_API_SECRET, true, true);
	const unauthenticatedClient = getAuthenticatedClient('incorrect_secret', true, true);

	describe('Successful', () => {
		afterEach(async () => {
			await clearDb();
		});

		it('Authorized user can unwatch a bounty', async () => {
			// ARRANGE
			await authenticatedClient.mutate({
				mutation: CREATE_NEW_BOUNTY,
				variables: { address: contractAddress, organizationId, bountyId, repositoryId, type }
			});

			const user = await authenticatedClient.mutate({
				mutation: CREATE_USER,
				variables: { github }
			});

			const userId = user.data.upsertUser.id;
			
			await authenticatedClient.mutate({
				mutation: WATCH_BOUNTY,
				variables: { contractAddress: contractAddress, userId, github }
			});

			const userResult = await authenticatedClient.query({
				query: GET_USER,
				variables: { id: userId }
			});

			const bountyResult = await authenticatedClient.query({
				query: GET_BOUNTY_BY_ID,
				variables: { contractAddress }
			});

			// ASSERT
			expect(bountyResult.data.bounty).toMatchObject({
				__typename: 'Bounty',
				organizationId,
				address: contractAddress,
				watchingUsers: [
					{
						__typename: 'User',
						id: userId
					}
				]
			});
			
			expect(userResult.data.user).toMatchObject({
				__typename: 'User',
				id: userId,
				watchedBounties: {
					bountyConnection: {
						nodes: [
							{
								__typename: 'Bounty',
								address: contractAddress
							}
						]
					}
				}
			});

			// ACT
			await authenticatedClient.mutate({
				mutation: UNWATCH_BOUNTY,
				variables: { contractAddress: contractAddress, userId: userId }
			});

			// ASSERT
			const userResultUnwatched = await authenticatedClient.query({
				query: GET_USER,
				variables: { id: userId }
			});

			const bountyResultUnwatched = await authenticatedClient.query({
				query: GET_BOUNTY_BY_ID,
				variables: { contractAddress }
			});

			// ASSERT
			expect(userResultUnwatched.data.user).toMatchObject({
				__typename: 'User',
				id: userId,
				watchedBounties: {
					bountyConnection: {
						nodes: []
					}
				}
			});
			
			expect(bountyResultUnwatched.data.bounty).toMatchObject({
				__typename: 'Bounty',
				organizationId,
				address: contractAddress,
				watchingUsers: []
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
