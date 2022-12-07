
const { getAuthenticatedClient, getAuthenticatedClientIntegration } = require('../utils/configureApolloClient');
const { WATCH_BOUNTY, CREATE_NEW_BOUNTY, CREATE_USER, GET_USER, GET_BOUNTY_BY_ID } = require('../utils/queries');

const { clearDb } = require('../utils/clearDb');

describe('watchBounty', () => {
	const contractAddress = '0x8daf17assdfdf20c9dba35f005b6324f493785d239719d';
	const organizationId = 'organizationId';
	const bountyId = 'bountyId';
	const repositoryId = 'repositoryId';
	const type = '1';

	const github = process.env.GITHUB_USER_ID;
	const email = process.env.EMAIL;

	let authenticatedClient;
	let unauthenticatedClient;

	if (process.env.DEPLOY_ENV === 'production') {
		authenticatedClient = getAuthenticatedClientIntegration(process.env.OPENQ_API_SECRET, process.env.GITHUB_OAUTH_TOKEN, process.env.EMAIL_OAUTH);
		unauthenticatedClient = getAuthenticatedClientIntegration('incorrect_secret', 'invalid_oauth_token', 'invalid_email_oauth');
	} else {
		authenticatedClient = getAuthenticatedClient(process.env.OPENQ_API_SECRET, true, true);
		unauthenticatedClient = getAuthenticatedClient('incorrect_secret', 'signature', false, false);
	}

	describe('GITHUB', () => {
		describe('Successful', () => {
			afterEach(async () => {
				await clearDb();
			});

			it('Authorized user can watch a bounty', async () => {
				// ARRANGE
				await authenticatedClient.mutate({
					mutation: CREATE_NEW_BOUNTY,
					variables: { address: contractAddress, organizationId, bountyId, repositoryId, type }
				});

				const user = await authenticatedClient.mutate({
					mutation: CREATE_USER,
					variables: { github }
				});

				const userId = user.data.upsertUser.id;

				// ACT
				await authenticatedClient.mutate({
					mutation: WATCH_BOUNTY,
					variables: { contractAddress, userId, github }
				});

				// ASSERT
				const userResult = await authenticatedClient.query({
					query: GET_USER,
					variables: { id: userId }
				});

				const bountyResult = await authenticatedClient.query({
					query: GET_BOUNTY_BY_ID,
					variables: { contractAddress }
				});

				expect(bountyResult.data.bounty).toMatchObject({
					__typename: 'Bounty',
					organizationId,
					address: contractAddress,
					watchingUsers: [
						{
							__typename: 'User',
							id: userId
						}
					]
				});

				expect(userResult.data.user).toMatchObject({
					__typename: 'User',
					id: userId,
					watchedBounties: {
						bountyConnection: {
							nodes: [
								{
									__typename: 'Bounty',
									address: contractAddress
								}
							]
						}
					}
				});
			});
		});

		describe('UNSUCCESSFUL', () => {
			it('Unauthorized user cannot watch a bounty', async () => {
				expect(true).toBe(true);
			});
		});
	});

	describe('EMAIL', () => {
		describe('Successful', () => {
			afterEach(async () => {
				await clearDb();
			});

			it('Authorized user can watch a bounty', async () => {
				// ARRANGE
				await authenticatedClient.mutate({
					mutation: CREATE_NEW_BOUNTY,
					variables: { address: contractAddress, organizationId, bountyId, repositoryId, type }
				});

				const user = await authenticatedClient.mutate({
					mutation: CREATE_USER,
					variables: { email }
				});

				const userId = user.data.upsertUser.id;

				// ACT
				await authenticatedClient.mutate({
					mutation: WATCH_BOUNTY,
					variables: { contractAddress, userId, email }
				});

				// ASSERT
				const userResult = await authenticatedClient.query({
					query: GET_USER,
					variables: { id: userId }
				});

				const bountyResult = await authenticatedClient.query({
					query: GET_BOUNTY_BY_ID,
					variables: { contractAddress }
				});

				expect(bountyResult.data.bounty).toMatchObject({
					__typename: 'Bounty',
					organizationId,
					address: contractAddress,
					watchingUsers: [
						{
							__typename: 'User',
							id: userId
						}
					]
				});

				expect(userResult.data.user).toMatchObject({
					__typename: 'User',
					id: userId,
					watchedBounties: {
						bountyConnection: {
							nodes: [
								{
									__typename: 'Bounty',
									address: contractAddress
								}
							]
						}
					}
				});
			});
		});

		describe('UNSUCCESSFUL', () => {
			it('Unauthorized user cannot watch a bounty', async () => {
				expect(true).toBe(true);
			});
		});
	});
});
