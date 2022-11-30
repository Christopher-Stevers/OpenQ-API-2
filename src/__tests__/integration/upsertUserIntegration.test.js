
const { getAuthenticatedClientIntegration } = require('../utils/configureApolloClient');
const { UPSERT_USER, GET_USER } = require('../utils/queries');

const dotenv = require('dotenv');
const { clearDbUser } = require('../utils/clearDb');
dotenv.config({ path: '../../../.env.test' });

/**
 * To run this, change DEPLOY_ENV to 'production' in .env.test
 * That is how the proper Context with the ACTUAL GithubClient will be injected into ApolloServer
 */
describe.only('upsertUserIntegration.test', () => {
	describe('upsertUser', () => {
		const github = process.env.GITHUB_USER_ID;
		const otherGithub = process.env.OTHER_GITHUB_USER_ID;
		
		const email = process.env.EMAIL;
		const otherEmail = process.env.OTHER_EMAIL;
		// this client is authed for all 3 identifiers
		const authenticatedClient = getAuthenticatedClientIntegration(process.env.OPENQ_API_SECRET, process.env.GITHUB_OAUTH_TOKEN, process.env.EMAIL_OAUTH);

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
					email: 'abc@gmail.com'
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
	
		describe.only('Unauthenticated', () => {
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

			it.only('should fail for unauthenticated calls - GITHUB UNAUTHORIZED', async () => {
				try {
					await authenticatedClient.mutate({
						mutation: UPSERT_USER,
						variables: { github: otherGithub }
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
