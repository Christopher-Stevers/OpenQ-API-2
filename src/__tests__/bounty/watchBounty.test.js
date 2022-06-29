
const { WATCH_BOUNTY } = require('../queries');
const { getAuthenticatedClient, getClient } = require('../utils/getClient');
const { CREATE_NEW_BOUNTY, UNWATCH_BOUNTY } = require('../queries');
const autoTaskClient = getAuthenticatedClient('secret123!');
const userAddress = '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266';
const contractAddress = '0x8daf17a20c9dba35f005b6324f493785d239719d';
beforeAll(async () => {
	const { PrismaClient } = require('@prisma/client');

	const prisma = new PrismaClient();
	await prisma.bounty.deleteMany({});
	jest.setTimeout(60000);
	await autoTaskClient.mutate({
		mutation: CREATE_NEW_BOUNTY,
		variables: { address: contractAddress, organizationId: 'mdp', bountyId: 'sdf' }
	});
});




describe('Watch and unwatch respond properly to user.', () => {
	const client = getClient();

	it('Should watch and unwatch when signed user attempts.', async () => {
		const input = {
			signature: '0xdf448d548305c70c8d5fb08d1c5a0cb3adfa6668eafa7a154b2c1eecf10c80ea1cc3afe23cc89f74323b02db7322b78c17add446c70ccbbb7a6ecfe58ac8b4bd1b',
			signer: '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266',
			value: 'OpenQ'
		};
		const watchData = await client.mutate({
			mutation: WATCH_BOUNTY,
			variables: { userAddress, contractAddress, signature: input.signature }
		});
		expect(watchData.data.watchBounty.watchingUserIds).toContain(input.signer);
		const unWatchData = await client.mutate({
			mutation: UNWATCH_BOUNTY,
			variables: { userAddress: input.signer, contractAddress, signature: input.signature }
		});
		expect(unWatchData.data.unWatchBounty.watchingUserIds).not.toContain(input.signer);

	});

	it('Should return bounty, but not watch when unsigned user attempts.', async () => {
		const input = {
			signature: '0xdf448d548305c70c8d5fb08d1c5a0cb3adfa6668eafa7a154b2c1eecf10c80ea1cc3afe23cc89f74323b02db7322b78c17add446c70ccbbb7a6ecfe58ac8b4bd1b',
			signer: '0xa7b7DcBb35A58294Ba9E51cC9AA20670E124536b',
			value: 'OpenQ'
		};
		const watchData = await client.mutate({
			mutation: WATCH_BOUNTY,
			variables: { userAddress: input.signer, contractAddress, signature: input.signature }
		});
		expect(watchData.data.watchBounty.watchingUserIds).not.toContain(input.signer);

	});

	it('Should return bounty, but not unWatch when unsigned user attempts.', async () => {
		const input = {
			signature: '0xdf448d548305c70c8d5fb08d1c5a0cb3adfa6668eafa7a154b2c1eecf10c80ea1cc3afe23cc89f74323b02db7322b78c17add446c70ccbbb7a6ecfe58ac8b4bd1b',
			signer: '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266',
			unsigned: '0xa7b7DcBb35A58294Ba9E51cC9AA20670E124536b',
			value: 'OpenQ'
		};
		const watchData = await client.mutate({
			mutation: WATCH_BOUNTY,
			variables: { userAddress: input.signer, contractAddress, signature: input.signature }
		});
		expect(watchData.data.watchBounty.watchingUserIds).toContain(input.signer);

		const unWatchData = await client.mutate({
			mutation: UNWATCH_BOUNTY,
			variables: { userAddress: input.unsigned, contractAddress, signature: input.signature }
		});
		expect(unWatchData.data.unWatchBounty.watchingUserIds).toContain(input.signer);

	});


});

