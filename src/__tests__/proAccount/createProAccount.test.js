const { getAuthenticatedClient, getAuthenticatedClientIntegration } = require('../utils/configureApolloClient');
const { CREATE_PRO_ACCOUNT, GET_PRO_ACCOUNT, UPSERT_USER } = require('../utils/queries');

const dotenv = require('dotenv');
const { clearDb } = require('../utils/clearDb');
dotenv.config({ path: '../../../.env.test' });

describe('createProAccount.test', () => {
	const github = 'github';
	const email = 'email';
	const userId = 'userId';
	describe('proAccount', () => {
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

			it('Authenticated client can create proAccount with EMAIL', async () => {
				// ACT
				const user = await authenticatedClient.mutate({
					mutation: UPSERT_USER,
					variables: { email }
				});
				const userId = user.data.upsertUser.id;

				const proAccount = 	await authenticatedClient.mutate({
					mutation: CREATE_PRO_ACCOUNT,
					variables: { name, userId,  email }
				});
				const id = proAccount.data.createProAccount.id;


				// ASSERET
				const { data } = await authenticatedClient.query({
					query: GET_PRO_ACCOUNT,
					variables: {  id }
				});

				expect(data.proAccount).toMatchObject({
					__typename: 'ProAccount',
					name
				});
				
			});

			it('Authenticated client can create proAccount with GITHUB', async () => {
				// ACT
				const user = await authenticatedClient.mutate({
					mutation: UPSERT_USER,
					variables: { github }
				});
				const userId = user.data.upsertUser.id;

				const proAccount = 	await authenticatedClient.mutate({
					mutation: CREATE_PRO_ACCOUNT,
					variables: { name, userId,  github }
				});
				const id = proAccount.data.createProAccount.id;


				// ASSERET
				const { data } = await authenticatedClient.query({
					query: GET_PRO_ACCOUNT,
					variables: {  id }
				});

				expect(data.proAccount).toMatchObject({
					__typename: 'ProAccount',
					name
				});
				
			});
		});

		describe('FAIL', () => {
			it('should fail for unauthenticated calls - GITHUB WITH NO AUTH', async () => {
				try {
					await unauthenticatedClient.mutate({
						mutation: CREATE_PRO_ACCOUNT,
						variables: { name,  userId,  github }
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
