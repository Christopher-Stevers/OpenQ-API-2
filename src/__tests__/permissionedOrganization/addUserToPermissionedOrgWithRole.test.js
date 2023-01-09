const { getAuthenticatedClient, getAuthenticatedClientIntegration } = require('../utils/configureApolloClient');
const { CREATE_PERMISSIONED_ORGANIZATION, GET_PERMISSIONED_ORGANIZATION, UPSERT_USER, CREATE_PRODUCT, ADD_USER_TO_PERMISSIONED_ORGANIZATION } = require('../utils/queries');

const dotenv = require('dotenv');
const { clearDb } = require('../utils/clearDb');
dotenv.config({ path: '../../../.env.test' });

describe('createPermissionedOrganization.test', () => {
	const email = process.env.EMAIL;
	const github = process.env.GITHUB_USER_ID;
	const orgName = 'orgName';
	describe('permissionedOrganization', () => {

		let authenticatedClientGithub, authenticatedClientEmail;

		if (process.env.DEPLOY_ENV === 'production') {
			authenticatedClientGithub = getAuthenticatedClientIntegration(process.env.OPENQ_API_SECRET, process.env.GITHUB_OAUTH_TOKEN, null);
			authenticatedClientEmail = getAuthenticatedClientIntegration(process.env.OPENQ_API_SECRET, null, process.env.EMAIL_DID_TOKEN);
			
		} else {
			authenticatedClientGithub = getAuthenticatedClient(process.env.OPENQ_API_SECRET, true, null);
			authenticatedClientEmail = getAuthenticatedClient(process.env.OPENQ_API_SECRET, null, true);
		}
		beforeEach(async () => {
			await clearDb();
		});
		describe('SUCCESS', () => {

			it('adds user to role array(s)', async () => {
				// ACT

				const githubUser = await authenticatedClientGithub.mutate({
					mutation: UPSERT_USER,
					variables: { github }
				});
				const emailUser = await authenticatedClientEmail.mutate({
					mutation: UPSERT_USER,
					variables: { email }
				});
				const githubUserId = githubUser.data.upsertUser.id;
				const emailUserId = emailUser.data.upsertUser.id;



				const permissionedOrganization = await authenticatedClientGithub.mutate({
					mutation: CREATE_PERMISSIONED_ORGANIZATION,
					variables: { name: orgName, userId: githubUserId, github }
				});
				const permissionedOrganizationId = permissionedOrganization.data.createPermissionedOrganization.id;

				await authenticatedClientGithub.mutate({
					mutation: ADD_USER_TO_PERMISSIONED_ORGANIZATION,
					variables: { targetUserId: emailUserId, currentUserId: githubUserId, permissionedOrganizationId, role: 'MEMBER' }
				});
				const memberResult = await authenticatedClientGithub.query({
					query: GET_PERMISSIONED_ORGANIZATION,
					variables: { id: permissionedOrganizationId }
				});

				expect(memberResult.data.permissionedOrganization).toMatchObject({ '__typename': 'PermissionedOrganization', 'adminUsers': { 'nodes': [{ 'id': githubUserId, }] }, 'ownerUsers': { 'nodes': [{ 'id': githubUserId, }] }, 'memberUsers': { 'nodes': [{ 'id': githubUserId, }, { 'id': emailUserId, }] } });


				await authenticatedClientGithub.mutate({
					mutation: ADD_USER_TO_PERMISSIONED_ORGANIZATION,
					variables: { targetUserId: emailUserId, currentUserId: githubUserId, permissionedOrganizationId, role: 'ADMIN' }
				});

				const adminResult = await authenticatedClientGithub.query({
					query: GET_PERMISSIONED_ORGANIZATION,
					variables: { id: permissionedOrganizationId }
				});

				expect(adminResult.data.permissionedOrganization).toMatchObject({ 'adminUsers': { 'nodes': [{ id: githubUserId }, { id: emailUserId }] }, ownerUsers: { 'nodes': [{ id: githubUserId, }] }, memberUsers: { nodes: [{ id: githubUserId, }, { id: emailUserId }] } });
				



			});

		});

		describe('FAIL', () => {
			it('should fail for unauthenticated calls - NO AUTH', async () => {
				const emailUser = await authenticatedClientEmail.mutate({
					mutation: UPSERT_USER,
					variables: { email }
				});
				const emailUserId = emailUser.data.upsertUser.id;

				const githubUser = await authenticatedClientGithub.mutate({
					mutation: UPSERT_USER,
					variables: { github }
				});
				const githubUserId = githubUser.data.upsertUser.id;


				const permissionedOrganization = await authenticatedClientEmail.mutate({
					mutation: CREATE_PERMISSIONED_ORGANIZATION,
					variables: { name: orgName, userId: emailUserId, email }
				});
				const permissionedOrganizationId = permissionedOrganization.data.createPermissionedOrganization.id;

				try {

					await authenticatedClientGithub.mutate({
						mutation: ADD_USER_TO_PERMISSIONED_ORGANIZATION,
						variables: { targetUserId: emailUserId, currentUserId: githubUserId, permissionedOrganizationId, role: 'ADMIN' }
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