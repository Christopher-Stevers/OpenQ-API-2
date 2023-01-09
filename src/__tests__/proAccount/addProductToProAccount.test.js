const { getAuthenticatedClient, getAuthenticatedClientIntegration } = require('../utils/configureApolloClient');
const { CREATE_PRO_ACCOUNT, GET_PRO_ACCOUNT, UPSERT_USER, CREATE_PRODUCT, ADD_PRODUCT_TO_PRO_ACCOUNT } = require('../utils/queries');

const dotenv = require('dotenv');
const { clearDb } = require('../utils/clearDb');
dotenv.config({ path: '../../../.env.test' });

describe('createProAccount.test', () => {
	const email = process.env.EMAIL;
	const orgName = 'orgName';
	const productName = 'productName';
	describe('proAccount', () => {

		let authenticatedClient;
		let unauthenticatedClient;

		if(process.env.DEPLOY_ENV === 'production') {
			authenticatedClient = getAuthenticatedClientIntegration(process.env.OPENQ_API_SECRET, process.env.GITHUB_OAUTH_TOKEN, process.env.EMAIL_DID_TOKEN);
			unauthenticatedClient = getAuthenticatedClientIntegration('incorrect_secret', 'invalid_oauth_token', 'invalid_email_oauth');
		} else  {
			authenticatedClient = getAuthenticatedClient(process.env.OPENQ_API_SECRET, true, true);
			unauthenticatedClient  = getAuthenticatedClient('incorrect_secret', 'signature', false, false);
		}
		afterEach(async () => {
			await clearDb();
		});
		describe('SUCCESS', () => {

			it('API_SECRET can add Product to proAccount', async () => {
				// ACT
				const user = await authenticatedClient.mutate({
					mutation: UPSERT_USER,
					variables: { email }
				});
				const userId = user.data.upsertUser.id;

				const proAccount = 	await authenticatedClient.mutate({
					mutation: CREATE_PRO_ACCOUNT,
					variables: { name: orgName, userId,  email }
				});
				const product = 	await authenticatedClient.mutate({
					mutation: CREATE_PRODUCT,
					variables: { name: productName }
				});
			
				const productId = product.data.createProduct.id;
				const proAccountId = proAccount.data.createProAccount.id;
				
				await authenticatedClient.mutate({
					mutation: ADD_PRODUCT_TO_PRO_ACCOUNT,
					variables: { productId, userId, proAccountId}
				});

				// ASSERET
				const { data } = await authenticatedClient.query({
					query: GET_PRO_ACCOUNT,
					variables: {  id: proAccountId }
				});

				expect(data.proAccount).toMatchObject({
					
					__typename: 'ProAccount',
					permissionedProducts:  {
						__typename: 'Products',
						nodes:  [
							{
								'id': productId, 
								'name': 'productName',
							},
						],
					}
				});
				
			});

		});
		
		describe('FAIL', () => {
			it('should fail for unauthenticated calls - NO AUTH', async () => {
				const user = await authenticatedClient.mutate({
					mutation: UPSERT_USER,
					variables: { email }
				});
				const userId = user.data.upsertUser.id;

				const proAccount = 	await authenticatedClient.mutate({
					mutation: CREATE_PRO_ACCOUNT,
					variables: { name: orgName, userId,  email }
				});
				const proAccountId = proAccount.data.createProAccount.id;
				const product = 	await authenticatedClient.mutate({
					mutation: CREATE_PRODUCT,
					variables: { name: productName }
				});
				const productId = product.data.createProduct.id;
				try {
					await unauthenticatedClient.mutate({
						mutation: ADD_PRODUCT_TO_PRO_ACCOUNT,
						variables: { productId, userId, proAccountId}
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
