const { getAuthenticatedClient } = require('../utils/configureApolloClient');
const { UPSERT_USER, GET_USER } = require('../utils/queries');

const dotenv = require('dotenv');
const { clearDbUser } = require('../utils/clearDb');
dotenv.config({ path: '../../../.env.test' });

describe('upsertUser.test', () => {
	describe('upsertUser', () => {
		const email = 'email';
		const github = 'github';
	
		// this client is authed for all 3 identifiers
		const authenticatedClient = getAuthenticatedClient(process.env.OPENQ_API_SECRET, true, true);

		const unauthenticatedClient_INVALID_EMAIL = getAuthenticatedClient(process.env.OPENQ_API_SECRET, false, false);
		const unauthenticatedClient_INVALID_GITHUB = getAuthenticatedClient(process.env.OPENQ_API_SECRET, true, false);

		describe('Successful calls to upsertUser with email, address, github and/or address', () => {
			afterEach(async () => {
				await clearDbUser();
			});
	
			it('Authenticated client can create user with email', async () => {
				await authenticatedClient.mutate({
					mutation: UPSERT_USER,
					variables: { email }
				});
	
				const { data } = await authenticatedClient.query({
					query: GET_USER,
					variables: { email }
				});
	
				expect(data.user).toMatchObject({
					__typename: 'User',
					email: 'email'
				});
			});

			it('Authenticated client can create user with github and valid oauth', async () => {
				await authenticatedClient.mutate({
					mutation: UPSERT_USER,
					variables: { github }
				});
	
				const { data } = await authenticatedClient.query({
					query: GET_USER,
					variables: { github }
				});
	
				expect(data.user).toMatchObject({
					__typename: 'User',
					github
				});
			});
		});
	
		describe('Unauthenticated', () => {
			it('should fail for unauthenticated calls - EMAIL WITH NO AUTH', async () => {
				try {
					await unauthenticatedClient_INVALID_EMAIL.mutate({
						mutation: UPSERT_USER,
						variables: { email }
					});
					throw('Should not reach this point');
				} catch (error) {
					console.log(error);
					expect(error.graphQLErrors[0].extensions.code).toEqual('UNAUTHENTICATED');
				}
			});

			it('should fail for unauthenticated calls - GITHUB UNAUTHORIZED', async () => {
				try {
					await unauthenticatedClient_INVALID_GITHUB.mutate({
						mutation: UPSERT_USER,
						variables: { github }
					});
					throw('Should not reach this point');
				} catch (error) {
					console.log(error);
					expect(error.graphQLErrors[0].extensions.code).toEqual('UNAUTHENTICATED');
				}
			});
		});
	});
});
