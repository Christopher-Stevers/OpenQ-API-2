
const { getAuthenticatedClient } = require('../utils/configureApolloClient');
const { STAR_ORGANIZATION, UNSTAR_ORGANIZATION, GET_USER, GET_ORGANIZATION, BLACKLIST_ORGANIZATION, CREATE_USER } = require('../utils/queries');

const { clearDbOrganization, clearDb, clearDbUser } = require('../utils/clearDb');

describe('starOrg', () => {
	const organizationId = 'organizationId';
	const github = 'github';

	const authenticatedClient = getAuthenticatedClient(process.env.BANHAMMER, 'signature', true, true);
	const unauthenticatedClient = getAuthenticatedClient('incorrect_secret', 'signature', false, false);

	describe('Successful', () => {
		afterEach(async () => {
			await clearDbOrganization();
			await clearDbUser();
		});

		it.only('Authenticated client can create bounty', async () => {
			// CREATES THE ORGANIZATION
			await authenticatedClient.mutate({
				mutation: BLACKLIST_ORGANIZATION,
				variables: { organizationId, blacklist: false }
			});

			// CREATES A DEMO USER
			const result = await authenticatedClient.mutate({
				mutation: CREATE_USER,
				variables: { github }
			});
			const userId = result.data.upsertUser.id;

			// ACT
			await authenticatedClient.mutate({
				mutation: STAR_ORGANIZATION,
				variables: { organizationId, userId, github }
			});
	
			const { data } = await authenticatedClient.query({
				query: GET_ORGANIZATION,
				variables: { organizationId }
			});

			const userResult = await authenticatedClient.query({
				query: GET_USER,
				variables: { id: userId }
			});
	
			expect(data.organization).toMatchObject({
				id: organizationId,
				starringUsers: [{ id: userId }]
			});

			expect(userResult.data.user).toMatchObject({
				id: userId,
				starredOrganizations: [{ id: organizationId }]
			});

			// ACT
			await authenticatedClient.mutate({
				mutation: UNSTAR_ORGANIZATION,
				variables: { organizationId, userId, github }	
			});

			// ASSERT
			const organizationUnstarResult = await authenticatedClient.query({
				query: GET_ORGANIZATION,
				variables: { organizationId }
			});

			const userUnstarResult = await authenticatedClient.query({
				query: GET_USER,
				variables: { id: userId }
			});
	
			expect(organizationUnstarResult.data.organization).toMatchObject({
				id: organizationId,
				starringUsers: []
			});

			expect(userUnstarResult.data.user).toMatchObject({
				id: userId,
				starredOrganizations: []
			});
		});
	});

	describe('Unsuccessful', () => {
		afterEach(async () => {
			await clearDbOrganization();
			await clearDbUser();
		});

		it('should fail for unauthenticated calls', async () => {
			try {
				// ARRANGE
				// CREATES THE ORGANIZATION
				await authenticatedClient.mutate({
					mutation: BLACKLIST_ORGANIZATION,
					variables: { organizationId, blacklist: false }
				});

				// CREATES A DEMO USER
				const result = await authenticatedClient.mutate({
					mutation: CREATE_USER,
					variables: { github }
				});
				const userId = result.data.upsertUser.id;
			
				// ACT
				await unauthenticatedClient.mutate({
					mutation: STAR_ORGANIZATION,
					variables: { organizationId, userId, github }
				});
				throw('Should not reach this point');
			} catch (error) {
				console.log(error);
				expect(error.graphQLErrors[0].extensions.code).toEqual('UNAUTHENTICATED');
			}
		});
	 });
});
