
const { getAuthenticatedClient, getAuthenticatedClientIntegration } = require('../utils/configureApolloClient');
const { CREATE_PRODUCT, GET_PRODUCT, UPDATE_PRODUCT } = require('../utils/queries');
const dotenv = require('dotenv');
const { clearDb } = require('../utils/clearDb');
dotenv.config({ path: '../../../.env.test' });

describe('updateProduct.test', () => {
	describe('upsertUser', () => {
		const name = 'name';
		const newName = 'newName';
		let authenticatedClient;
		let unauthenticatedClient;

		if(process.env.DEPLOY_ENV === 'production') {
			authenticatedClient = getAuthenticatedClientIntegration(process.env.OPENQ_API_SECRET, process.env.GITHUB_OAUTH_TOKEN, process.env.EMAIL_DID_TOKEN);
			unauthenticatedClient = getAuthenticatedClientIntegration('incorrect_secret', 'invalid_oauth_token', 'invalid_email_oauth');
		} else  {
			authenticatedClient = getAuthenticatedClient(process.env.OPENQ_API_SECRET, true, true);
			unauthenticatedClient  = getAuthenticatedClient('incorrect_secret', 'signature', false, false);
		}
		describe('SUCCESS', () => {
			afterEach(async () => {
				await clearDb();
			});

			it('Authenticated client can create user with email', async () => {
				// ACT
				const product = 	await authenticatedClient.mutate({
					mutation: CREATE_PRODUCT,
					variables: { name }
				});
				const id = product.data.createProduct.id;

				try{
				// ASSERET
					await authenticatedClient.mutate({
						mutation: UPDATE_PRODUCT,
						variables: { name: newName, id }
					});

					const { data } = await authenticatedClient.query({
						query: GET_PRODUCT,
						variables: { id }
					});

					expect(data.product).toMatchObject({
						__typename: 'Product',
						name: newName
					});
				}
				catch(err){
					console.log(err);
				}
			});
		});

		describe('FAIL', () => {
			it('should fail for unauthenticated calls - NO AUTH', async () => {
				try {
					const product = await unauthenticatedClient.mutate({
						mutation: CREATE_PRODUCT,
						variables: { name }
					});
					const id = product.data.createProduct.id;
					await unauthenticatedClient.mutate({
						mutation: UPDATE_PRODUCT,
						variables: { id, name }
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
