const { getAuthenticatedClient, getAuthenticatedClientIntegration } = require('../utils/configureApolloClient');
const { CREATE_PERMISSIONED_ORGANIZATION, GET_PERMISSIONED_ORGANIZATION, UPSERT_USER, CREATE_PRODUCT, ADD_PRODUCT_TO_PERMISSIONED_ORGANIZATION } = require('../utils/queries');

const dotenv = require('dotenv');
const { clearDb } = require('../utils/clearDb');
dotenv.config({ path: '../../../.env.test' });

describe('createPermissionedOrganization.test', () => {
	const email = process.env.EMAIL;
	const orgName = 'orgName';
	const productName = 'productName';
	describe('permissionedOrganization', () => {

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

			it('API_SECRET can add Product to permissionedOrganization', async () => {
				// ACT
				const user = await authenticatedClient.mutate({
					mutation: UPSERT_USER,
					variables: { email }
				});
				const userId = user.data.upsertUser.id;

				const permissionedOrganization = 	await authenticatedClient.mutate({
					mutation: CREATE_PERMISSIONED_ORGANIZATION,
					variables: { name: orgName, userId,  email }
				});
				const product = 	await authenticatedClient.mutate({
					mutation: CREATE_PRODUCT,
					variables: { name: productName }
				});
			
				const productId = product.data.createProduct.id;
				const permissionedOrganizationId = permissionedOrganization.data.createPermissionedOrganization.id;
				
				await authenticatedClient.mutate({
					mutation: ADD_PRODUCT_TO_PERMISSIONED_ORGANIZATION,
					variables: { productId, userId, permissionedOrganizationId}
				});

				// ASSERET
				const { data } = await authenticatedClient.query({
					query: GET_PERMISSIONED_ORGANIZATION,
					variables: {  id: permissionedOrganizationId }
				});

				expect(data.permissionedOrganization).toMatchObject({
					
					__typename: 'PermissionedOrganization',
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

				const permissionedOrganization = 	await authenticatedClient.mutate({
					mutation: CREATE_PERMISSIONED_ORGANIZATION,
					variables: { name: orgName, userId,  email }
				});
				const permissionedOrganizationId = permissionedOrganization.data.createPermissionedOrganization.id;
				const product = 	await authenticatedClient.mutate({
					mutation: CREATE_PRODUCT,
					variables: { name: productName }
				});
				const productId = product.data.createProduct.id;
				try {
					await unauthenticatedClient.mutate({
						mutation: ADD_PRODUCT_TO_PERMISSIONED_ORGANIZATION,
						variables: { productId, userId, permissionedOrganizationId}
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
