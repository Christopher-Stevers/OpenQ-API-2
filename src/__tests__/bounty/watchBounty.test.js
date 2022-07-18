const { WATCH_BOUNTY, GET_USER_BY_HASH } = require('../queries');
const { getAuthenticatedClient } = require('../utils/getClient');
const { CREATE_NEW_BOUNTY, UNWATCH_BOUNTY } = require('../queries');
const autoTaskClient = getAuthenticatedClient('secret123!');
const userAddress = '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266';
const contractAddress = '0x8daf17a20c9dba35f005b6324f493785d239719d';
beforeAll(async () => {
	jest.setTimeout(100000);
	const { PrismaClient } = require('../../../generated/client');

	const prisma = new PrismaClient();
	await prisma.bounty.deleteMany({});
	await autoTaskClient.mutate({
		mutation: CREATE_NEW_BOUNTY,
		variables: { address: contractAddress, organizationId: 'mdp', bountyId: 'sdf' }
	});
});




describe('Watch and unwatch respond properly to user.', () => {

	it('Should watch and unwatch when signed user attempts.', async () => {
		const input = {
			signature: '0xdf448d548305c70c8d5fb08d1c5a0cb3adfa6668eafa7a154b2c1eecf10c80ea1cc3afe23cc89f74323b02db7322b78c17add446c70ccbbb7a6ecfe58ac8b4bd1b',
			signer: '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266',
			value: 'OpenQ'
		};
		const client = getAuthenticatedClient('_', input.signature);
		const watchData = await client.mutate({
			mutation: WATCH_BOUNTY,
			variables: { userAddress, contractAddress }
		});
		expect(watchData.data.watchBounty.watchingUserIds).toContain(input.signer);
		const unWatchData = await client.mutate({
			mutation: UNWATCH_BOUNTY,
			variables: { userAddress: input.signer, contractAddress }
		});
		const userData = await client.query({
			query: GET_USER_BY_HASH,
			variables: { userAddress }
		});
		expect(unWatchData.data.unWatchBounty.watchingUserIds).not.toContain(input.signer);
		expect(userData.data).toMatchObject({ user: { __typename: 'User', watchedBountyIds: [] } });

	});

	it('Should throw when unsigned user attempts to watch.', async () => {
		const input = {
			signature: '0xdf448d548305c70c8d5fb08d1c5a0cb3adfa6668eafa7a154b2c1eecf10c80ea1cc3afe23cc89f74323b02db7322b78c17add446c70ccbbb7a6ecfe58ac8b4bd1b',
			signer: '0xa7b7DcBb35A58294Ba9E51cC9AA20670E124536b',
			value: 'OpenQ'
		};
		const client = getAuthenticatedClient('_', input.signature);
		const watch = async () => {
			return await client.mutate({
				mutation: WATCH_BOUNTY,
				variables: { userAddress: input.signer, contractAddress, signature: input.signature }
			});
		};
		await expect(watch).rejects.toThrow(Error);

	});

	it('Should throw when unsigned user attempts to unwatch.', async () => {
		const input = {
			signature: '0xdf448d548305c70c8d5fb08d1c5a0cb3adfa6668eafa7a154b2c1eecf10c80ea1cc3afe23cc89f74323b02db7322b78c17add446c70ccbbb7a6ecfe58ac8b4bd1b',
			signer: '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266',
			unsigned: '0xa7b7DcBb35A58294Ba9E51cC9AA20670E124536b',
			value: 'OpenQ'
		};
		const client = getAuthenticatedClient('_', input.signature);
		const watchData = await client.mutate({
			mutation: WATCH_BOUNTY,
			variables: { userAddress: input.signer, contractAddress }
		});
		expect(watchData.data.watchBounty.watchingUserIds).toContain(input.signer);
		const unWatch = async () => {
			return await client.mutate({
				mutation: UNWATCH_BOUNTY,
				variables: { userAddress: input.unsigned, contractAddress }
			});

		};
		await expect(unWatch()).rejects.toThrow(Error);

	});


});

