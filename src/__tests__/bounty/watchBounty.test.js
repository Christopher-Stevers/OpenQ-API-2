
const { getAuthenticatedClient } = require('../utils/configureApolloClient');
const { WATCH_BOUNTY, CREATE_NEW_BOUNTY, CREATE_USER, GET_BOUNTY_BY_ID } = require('../utils/queries');

const { clearDb } = require('../utils/clearDb');

describe('watchBounty', () => {
	const contractAddress = '0x8daf17assdfdf20c9dba35f005b6324f493785d239719d';
	const userId = 'userId';
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

		it.only('Authorized user can watch a bounty', async () => {
			// ARRANGE
			await authenticatedClient.mutate({
				mutation: CREATE_NEW_BOUNTY,
				variables: { address: contractAddress, organizationId, bountyId, repositoryId, type }
			});

			const user = await authenticatedClient.mutate({
				mutation: CREATE_USER,
				variables: { github }
			});

			// ACT
			await authenticatedClient.mutate({
				mutation: WATCH_BOUNTY,
				variables: { contractAddress: contractAddress, userId: user.data.upsertUser.id }
			});

			// ASSERT
			expect(true).toEqual(true);
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
