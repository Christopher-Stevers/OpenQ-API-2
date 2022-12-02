
const { getAuthenticatedClient } = require('../utils/configureApolloClient');
const { BLACKLIST_ORGANIZATION, GET_ORGANIZATION } = require('../utils/queries');

const { clearDbOrganization } = require('../utils/clearDb');

describe('blacklistOrg', () => {
	const organizationId = 'organizationId';

	const authenticatedClient = getAuthenticatedClient(process.env.BANHAMMER, 'signature', true, true);
	const unauthenticatedClient = getAuthenticatedClient('incorrect_secret', 'signature', true, true);

	describe('Successful', () => {
		afterEach(async () => {
			await clearDbOrganization();
		});

		it('Authenticated client can create bounty', async () => {
			// ARRANGE
			await authenticatedClient.mutate({
				mutation: BLACKLIST_ORGANIZATION,
				variables: { organizationId, blacklist: true }
			});
	
			const { data } = await authenticatedClient.query({
				query: GET_ORGANIZATION,
				variables: { organizationId }
			});
	
			// ASSERT
			expect(data.organization).toMatchObject({
				id: organizationId,
				blacklisted: true
			});

			// ACT
			await authenticatedClient.mutate({
				mutation: BLACKLIST_ORGANIZATION,
				variables: { organizationId, blacklist: false }
			});
	
			// ASSERT
			const newOrgResult = await authenticatedClient.query({
				query: GET_ORGANIZATION,
				variables: { organizationId }
			});
	
			expect(newOrgResult.data.organization).toMatchObject({
				id: organizationId,
				blacklisted: false
			});
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
