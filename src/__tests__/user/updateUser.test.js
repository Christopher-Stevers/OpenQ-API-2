
const { getAuthenticatedClient } = require('../utils/getClient');
const { UPDATE_USER, GET_USER_BY_HASH } = require('../queries');

// URL for connecting from OUTSIDE the docker-compose environment
// mongodb://root:root@localhost:27018/openqdb?authSource=admin

const dotenv = require('dotenv');
const { clearDbUser } = require('../utils/clearDb');
dotenv.config({ path: '../../../.env.test' });

describe('updateUser', () => {
	const address = '0x1abcD810374b2C0fCDD11cFA280Df9dA7970da4e';
	const validSignatureFor0x1abc = '0xb4fceac372e7dd620bf581ef3bd399116e79a3c3744ac8b09e876132ff32142b5e612bc0e3b169b4b5e930aa598c7c3501f4e2d3e9e26548d8dde0ac916aff7c1b';
	const invalidSignatureFor0x1abc = '0xae641394f837b5657d768f0a5a6a874ffad7b9e4298f0d300bb56bae7da65874440a5f139c7eaca49862f345d7bb64362b375049faa180a230f96203c564485d1b';

	const authenticatedClient = getAuthenticatedClient('secret123!', validSignatureFor0x1abc);
	const unauthenticatedClient = getAuthenticatedClient('incorrect_secret', invalidSignatureFor0x1abc);

	describe('Successful', () => {
		afterEach(async () => {
			await clearDbUser();
		});

		it('Authenticated client can update user', async () => {
			await authenticatedClient.mutate({
				mutation: UPDATE_USER,
				variables: { address }
			});

			const { data } = await authenticatedClient.query({
				query: GET_USER_BY_HASH,
				variables: { userAddress: address }
			});

			expect(data.user).toMatchObject({
				__typename: 'User',
				address: '0x1abcD810374b2C0fCDD11cFA280Df9dA7970da4e'
			});
		});
	});

	describe('Unsuccessful', () => {
		it('should fail for unauthenticated calls', async () => {
			try {
				await unauthenticatedClient.mutate({
					mutation: UPDATE_USER,
					variables: { address }
				});
				throw('Should not reach this line');
			} catch (error) {
				expect(error.graphQLErrors[0].extensions.code).toEqual('UNAUTHENTICATED');
			}
		});
	 });
});
