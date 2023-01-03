// test combineUsers mutation
const { getAuthenticatedClient, getAuthenticatedClientIntegration } = require('../utils/configureApolloClient');
const {UPSERT_USER, COMBINE_USERS, GET_USER } = require('../utils/queries');

const dotenv = require('dotenv');
const { clearDb } = require('../utils/clearDb');
dotenv.config({ path: '../../../.env.test' });

describe('upsertUser.test', () => {
	describe('upsertUser', () => {
		const email = process.env.EMAIL;
		const github = process.env.GITHUB_USER_ID;
		const username = process.env.GITHUB_USER_LOGIN;

		let authenticatedClient;
		let authenticatedClient_VALID_GITHUB;
		let authenticatedClient_VALID_EMAIL;  
		let unauthenticatedClient_INVALID_GITHUB;
		let unauthenticatedClient_INVALID_EMAIL;

		if (process.env.DEPLOY_ENV === 'production') {
			authenticatedClient = getAuthenticatedClientIntegration(process.env.OPENQ_API_SECRET, process.env.GITHUB_OAUTH_TOKEN, process.env.EMAIL_DID_TOKEN);
			authenticatedClient_VALID_GITHUB = getAuthenticatedClientIntegration(process.env.OPENQ_API_SECRET, process.env.GITHUB_OAUTH_TOKEN, 'invalid');
			authenticatedClient_VALID_EMAIL = getAuthenticatedClientIntegration(process.env.OPENQ_API_SECRET, 'invalid', process.env.EMAIL_DID_TOKEN);
			unauthenticatedClient_INVALID_GITHUB = getAuthenticatedClientIntegration(process.env.OPENQ_API_SECRET, true, 'invalid');
			unauthenticatedClient_INVALID_EMAIL = getAuthenticatedClientIntegration(process.env.OPENQ_API_SECRET, 'invalid', true);
		} else {
			authenticatedClient = getAuthenticatedClient(process.env.OPENQ_API_SECRET, true, true);
			authenticatedClient_VALID_GITHUB = getAuthenticatedClient(process.env.OPENQ_API_SECRET, false, true);
			authenticatedClient_VALID_EMAIL = getAuthenticatedClient(process.env.OPENQ_API_SECRET, true, false);
			unauthenticatedClient_INVALID_GITHUB = getAuthenticatedClient(process.env.OPENQ_API_SECRET, false, true);
			unauthenticatedClient_INVALID_EMAIL = getAuthenticatedClient(process.env.OPENQ_API_SECRET, true, false);
		}

		describe('EMAIL', () => {
			describe('SUCCESS', () => {
				afterEach(async () => {
					await clearDb();
				});

				it('Authenticated client can create user with email', async () => {
					// ACT
                    
					await authenticatedClient_VALID_GITHUB.mutate({
						mutation: UPSERT_USER,
						variables: { email }
					});
                    
					await authenticatedClient_VALID_EMAIL.mutate({
						mutation: UPSERT_USER,
						variables: { github }
					});

					await authenticatedClient.mutate({
						mutation: COMBINE_USERS,
						variables: { email, github }
					});
					

					// ASSERT
					const { data } = await authenticatedClient.query({
						query: GET_USER,
						variables: { email }
					});

					expect(data.user).toMatchObject({
						__typename: 'User',
						email,
						username: 'Christopher-Stevers',
						github
					});
                
				});
			});

			describe('FAIL', () => {
				it('should fail for unauthenticated calls - EMAIL WITH NO AUTH', async () => {
					try {
						await unauthenticatedClient_INVALID_EMAIL.mutate({
							mutation: UPSERT_USER,
							variables: { email }
						});
						throw ('Should not reach this point');
					} catch (error) {
						// eslint-disable-next-line jest/no-conditional-expect
						expect(error.graphQLErrors[0].extensions.code).toEqual('UNAUTHENTICATED');
					}
				});
			});
		});

		describe('GITHUB', () => {
			describe('SUCCESS', () => {
				afterEach(async () => {
					await clearDb();
				});
				
				it('Authenticated client can create user with github and valid oauth', async () => {
					// ARRANGE
					await authenticatedClient.mutate({
						mutation: UPSERT_USER,
						variables: { github }
					});

					// ASSERT
					const { data } = await authenticatedClient.query({
						query: GET_USER,
						variables: { github }
					});

					expect(data.user).toMatchObject({
						__typename: 'User',
						github,
						username
					});
				});
			});

			describe('should fail for unauthenticated calls', () => {
				it('should fail for unauthenticated calls - GITHUB UNAUTHORIZED', async () => {
					try {
						await unauthenticatedClient_INVALID_GITHUB.mutate({
							mutation: UPSERT_USER,
							variables: { github }
						});
						throw ('Should not reach this point');
					} catch (error) {
						// eslint-disable-next-line jest/no-conditional-expect
						expect(error.graphQLErrors[0].extensions.code).toEqual('UNAUTHENTICATED');
					}
				});
			});
		});
	});
});
