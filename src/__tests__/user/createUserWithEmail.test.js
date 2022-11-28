
const { getAuthenticatedClient } = require('../utils/getClient');
const { CREATE_USER_WITH_EMAIL, GET_USER_WITH_EMAIL } = require('../queries');

const dotenv = require('dotenv');
const { clearDbUser } = require('../utils/clearDb');
dotenv.config({ path: '../../../.env.test' });

describe('createUserWithEmail.test', () => {
	const email = 'email';
	const validSignatureFor0x1abc = '0xb4fceac372e7dd620bf581ef3bd399116e79a3c3744ac8b09e876132ff32142b5e612bc0e3b169b4b5e930aa598c7c3501f4e2d3e9e26548d8dde0ac916aff7c1b';

	const authenticatedClient = getAuthenticatedClient('secret123!', validSignatureFor0x1abc);

	describe('Successful', () => {
		afterEach(async () => {
			await clearDbUser();
		});

		it('Authenticated client can create user with email', async () => {
			await authenticatedClient.mutate({
				mutation: CREATE_USER_WITH_EMAIL,
				variables: { email }
			});

			const { data } = await authenticatedClient.query({
				query: GET_USER_WITH_EMAIL,
				variables: { email }
			});

			expect(data.userByEmail).toMatchObject({
				__typename: 'User',
				email: 'email'
			});
		});
	});
});
