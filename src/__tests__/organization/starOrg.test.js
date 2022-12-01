
const { getAuthenticatedClient } = require('../utils/configureApolloClient');
const { STAR_ORGANIZATION, GET_USER, GET_ORGANIZATION, BLACKLIST_ORGANIZATION, CREATE_USER } = require('../utils/queries');

const { clearDbOrganization } = require('../utils/clearDb');

describe('starOrg', () => {
	const organizationId = 'organizationId';
	const github = 'github';

	const authenticatedClient = getAuthenticatedClient(process.env.BANHAMMER, 'signature', true, true);
	const unauthenticatedClient = getAuthenticatedClient('incorrect_secret', 'signature', true, true);

	describe('Successful', () => {
		afterEach(async () => {
			await clearDbOrganization();
		});

		it.only('Authenticated client can create bounty', async () => {
			await authenticatedClient.mutate({
				mutation: BLACKLIST_ORGANIZATION,
				variables: { organizationId, blacklist: false }
			});

			const result = await authenticatedClient.mutate({
				mutation: CREATE_USER,
				variables: { github }
			});

			const userId = result.data.upsertUser.id;

			await authenticatedClient.mutate({
				mutation: STAR_ORGANIZATION,
				variables: { organizationId, userId }
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

			console.log(userResult);
			expect(userResult.data.user).toMatchObject({
				id: organizationId,
				starredOrganizations: [{ id: organizationId }]
			});

			// await authenticatedClient.mutate({
			// 	mutation: BLACKLIST_ORGANIZATION,
			// 	variables: { organizationId, blacklist: false }
			// });
	
			// const newOrgResult = await authenticatedClient.query({
			// 	query: GET_ORGANIZATION,
			// 	variables: { organizationId }
			// });
	
			// expect(newOrgResult.data.organization).toMatchObject({
			// 	id: organizationId,
			// 	blacklisted: false
			// });
		});
	});

	describe('Unsuccessful', () => {
		it('should fail for unauthenticated calls', async () => {
			try {
				await unauthenticatedClient.mutate({
					mutation: BLACKLIST_ORGANIZATION,
					variables: { organizationId }
				});
				throw('Should not reach this point');
			} catch (error) {
				expect(error.graphQLErrors[0].extensions.code).toEqual('UNAUTHENTICATED');
			}
		});
	 });
});
