const { getAuthenticatedClient, getAuthenticatedClientIntegration } = require('../utils/configureApolloClient');
const { CREATE_PRO_ACCOUNT, GET_PRO_ACCOUNT, UPSERT_USER,  ADD_USER_TO_PRO_ACCOUNT } = require('../utils/queries');

const dotenv = require('dotenv');
const { clearDb } = require('../utils/clearDb');
dotenv.config({ path: '../../../.env.test' });

describe('createProAccount.test', () => {
	const email = process.env.EMAIL;
	const github = process.env.GITHUB_USER_ID;
	const orgName = 'orgName';
	describe('proAccount', () => {

		let authenticatedClientGithub, authenticatedClientEmail;

		if (process.env.DEPLOY_ENV === 'production') {
			authenticatedClientGithub = getAuthenticatedClientIntegration(process.env.OPENQ_API_SECRET, process.env.GITHUB_OAUTH_TOKEN, null);
			authenticatedClientEmail = getAuthenticatedClientIntegration(process.env.OPENQ_API_SECRET, null, process.env.EMAIL_DID_TOKEN);
			
		} else {
			authenticatedClientGithub = getAuthenticatedClient(process.env.OPENQ_API_SECRET, true, null);
			authenticatedClientEmail = getAuthenticatedClient(process.env.OPENQ_API_SECRET, null, true);
		}
		afterEach(async () => {
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



				const proAccount = await authenticatedClientGithub.mutate({
					mutation: CREATE_PRO_ACCOUNT,
					variables: { name: orgName, userId: githubUserId, github }
				});
				const proAccountId = proAccount.data.createProAccount.id;

				await authenticatedClientGithub.mutate({
					mutation: ADD_USER_TO_PRO_ACCOUNT,
					variables: { targetUserId: emailUserId, currentUserId: githubUserId, proAccountId, role: 'MEMBER' }
				});
				const memberResult = await authenticatedClientEmail.query({
					query: GET_PRO_ACCOUNT,
					variables: { id: proAccountId }
				});

				expect(memberResult.data.proAccount).toMatchObject({ '__typename': 'ProAccount', 'adminUsers': { 'nodes': [{ 'id': githubUserId, }] }, 'ownerUsers': { 'nodes': [{ 'id': githubUserId, }] }, 'memberUsers': { 'nodes': [{ 'id': githubUserId, }, { 'id': emailUserId, }] } });


			
				await authenticatedClientGithub.mutate({
					mutation: ADD_USER_TO_PRO_ACCOUNT,
					variables: { targetUserId: emailUserId, currentUserId: githubUserId, proAccountId, role: 'ADMIN' }
				});

				const adminResult = await authenticatedClientGithub.query({
					query: GET_PRO_ACCOUNT,
					variables: { id: proAccountId }
				});

				expect(adminResult.data.proAccount).toMatchObject({ 'adminUsers': { 'nodes': [{ id: githubUserId }, { id: emailUserId }] }, ownerUsers: { 'nodes': [{ id: githubUserId, }] }, memberUsers: { nodes: [{ id: githubUserId, }, { id: emailUserId }] } });
				
	
				
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


				const proAccount = await authenticatedClientEmail.mutate({
					mutation: CREATE_PRO_ACCOUNT,
					variables: { name: orgName, userId: emailUserId, email }
				});
				const proAccountId = proAccount.data.createProAccount.id;

				try {

					await authenticatedClientGithub.mutate({
						mutation: ADD_USER_TO_PRO_ACCOUNT,
						variables: { targetUserId: emailUserId, currentUserId: githubUserId, proAccountId, role: 'ADMIN' }
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