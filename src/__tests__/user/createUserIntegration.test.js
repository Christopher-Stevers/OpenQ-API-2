
const { getAuthenticatedClient, getAuthenticatedClientIntegration } = require('../utils/configureApolloClient');
const { CREATE_USER, GET_USER } = require('../utils/queries');

const dotenv = require('dotenv');
const { clearDbUser } = require('../utils/clearDb');
dotenv.config({ path: '../../../.env.test' });

/**
 * To run this, change DEPLOY_ENV to 'production' in .env.test
 * That is how the proper Context with the ACTUAL GithubClient will be injected into ApolloServer
 */
describe('createUserIntegration.test', () => {
	describe('createUser', () => {
		const validSignatureFor0x1abc = '0xb4fceac372e7dd620bf581ef3bd399116e79a3c3744ac8b09e876132ff32142b5e612bc0e3b169b4b5e930aa598c7c3501f4e2d3e9e26548d8dde0ac916aff7c1b';
		const invalidSignatureFor0x1abc = '0xae641394f837b5657d768f0a5a6a874ffad7b9e4298f0d300bb56bae7da65874440a5f139c7eaca49862f345d7bb64362b375049faa180a230f96203c564485d1b';
	
		const github = process.env.GITHUB_USER_ID;
		const otherGithub = process.env.OTHER_GITHUB_USER_ID;
		// this client is authed for all 3 identifiers
		const authenticatedClient = getAuthenticatedClientIntegration(process.env.OPENQ_API_SECRET, validSignatureFor0x1abc, process.env.GITHUB_OAUTH_TOKEN, true);

		const unauthenticatedClient_WRONG_API_KEY = getAuthenticatedClient('incorrect_secret', validSignatureFor0x1abc, null, null);
		const unauthenticatedClient_INVALID_GITHUB_OAUTH = getAuthenticatedClient(process.env.OPENQ_API_SECRET, invalidSignatureFor0x1abc, null, null);

		const address = '0x1abcD810374b2C0fCDD11cFA280Df9dA7970da4e';

		describe('Successful calls to createUser with email, address, github and/or address', () => {
			// afterEach(async () => {
			// 	await clearDbUser();
			// });
	
			it('Authenticated client can create user with email', async () => {
				await authenticatedClient.mutate({
					mutation: CREATE_USER,
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
	
			it('Authenticated client can create user with address and valid signature', async () => {
				await authenticatedClient.mutate({
					mutation: CREATE_USER,
					variables: { address }
				});
	
				const { data } = await authenticatedClient.query({
					query: GET_USER,
					variables: { address }
				});
	
				expect(data.user).toMatchObject({
					__typename: 'User',
					address
				});
			});

			it.only('Authenticated client can create user with github and valid oauth', async () => {
				await authenticatedClient.mutate({
					mutation: CREATE_USER,
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
			it('should fail for unauthenticated calls - INCORRECT API SECRET', async () => {
				try {
					await unauthenticatedClient_WRONG_API_KEY.mutate({
						mutation: CREATE_USER,
						variables: { address }
					});
					throw('Should not reach this point');
				} catch (error) {
					expect(error.graphQLErrors[0].extensions.code).toEqual('UNAUTHENTICATED');
				}
			});

			it('should fail for unauthenticated calls - INVALID OR NO SIGNATURE', async () => {
				try {
					await unauthenticatedClient_INVALID_SIGNATURE.mutate({
						mutation: CREATE_USER,
						variables: { address }
					});
					throw('Should not reach this point');
				} catch (error) {
					expect(error.graphQLErrors[0].extensions.code).toEqual('UNAUTHENTICATED');
				}
			});

			it('should fail for unauthenticated calls - EMAIL WITH NO AUTH', async () => {
				try {
					await unauthenticatedClient_INVALID_EMAIL.mutate({
						mutation: CREATE_USER,
						variables: { email }
					});
					throw('Should not reach this point');
				} catch (error) {
					expect(error.graphQLErrors[0].extensions.code).toEqual('UNAUTHENTICATED');
				}
			});

			it('should fail for unauthenticated calls - GITHUB UNAUTHORIZED', async () => {
				try {
					await authenticatedClient.mutate({
						mutation: CREATE_USER,
						variables: { github: otherGithub }
					});
					throw('Should not reach this point');
				} catch (error) {
					expect(error.graphQLErrors[0].extensions.code).toEqual('UNAUTHENTICATED');
				}
			});
		});
	});
});
