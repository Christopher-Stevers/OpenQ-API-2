const { getAuthenticatedClient, getAuthenticatedClientIntegration } = require('../utils/configureApolloClient');
const { CREATE_PRODUCT, GET_PRODUCT } = require('../utils/queries');

const dotenv = require('dotenv');
const { clearDb } = require('../utils/clearDb');
dotenv.config({ path: '../../../.env.test' });

describe('upsertUser.test', () => {
	describe('upsertUser', () => {
		const name = 'name';

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


				// ASSERET
				const { data } = await authenticatedClient.query({
					query: GET_PRODUCT,
					variables: { id }
				});

				expect(data.product).toMatchObject({
					__typename: 'Product',
					name
				});
			});
		});

		describe('FAIL', () => {
			it('should fail for unauthenticated calls - EMAIL WITH NO AUTH', async () => {
				try {
					await unauthenticatedClient.mutate({
						mutation: CREATE_PRODUCT,
						variables: { name }
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
