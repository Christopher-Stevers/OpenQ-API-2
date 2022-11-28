
const { getAuthenticatedClient } = require('../utils/getClient');
const { CREATE_USER, GET_USER } = require('../utils/queries');

const dotenv = require('dotenv');
const { clearDbUser } = require('../utils/clearDb');
dotenv.config({ path: '../../../.env.test' });

describe('createUser.test', () => {
	describe('createUser', () => {
		const email = 'email';
		const validSignatureFor0x1abc = '0xb4fceac372e7dd620bf581ef3bd399116e79a3c3744ac8b09e876132ff32142b5e612bc0e3b169b4b5e930aa598c7c3501f4e2d3e9e26548d8dde0ac916aff7c1b';
		const invalidSignatureFor0x1abc = '0xae641394f837b5657d768f0a5a6a874ffad7b9e4298f0d300bb56bae7da65874440a5f139c7eaca49862f345d7bb64362b375049faa180a230f96203c564485d1b';
	
		const authenticatedClient = getAuthenticatedClient(process.env.OPENQ_API_SECRET, validSignatureFor0x1abc);
		const unauthenticatedClient_WRONG_API_KEY = getAuthenticatedClient('incorrect_secret', validSignatureFor0x1abc);
		const unauthenticatedClient_INVALID_SIGNATURE = getAuthenticatedClient(process.env.OPENQ_API_SECRET, invalidSignatureFor0x1abc);

		const address = '0x1abcD810374b2C0fCDD11cFA280Df9dA7970da4e';

		describe('Successful calls to createUser with email, address, github and/or address', () => {
			afterEach(async () => {
				await clearDbUser();
			});
	
			it('Authenticated client can create user with email', async () => {
				await authenticatedClient.mutate({
					mutation: CREATE_USER,
					variables: { email }
				});
	
				const { data } = await authenticatedClient.query({
					query: GET_USER,
					variables: { email }
				});
	
				expect(data.user).toMatchObject({
					__typename: 'User',
					email: 'email'
				});
			});
	
			it('Authenticated client can create user with address and valid signature', async () => {
				await authenticatedClient.mutate({
					mutation: CREATE_USER,
					variables: { address }
				});
	
				const { data } = await authenticatedClient.query({
					query: GET_USER,
					variables: { address }
				});
	
				expect(data.user).toMatchObject({
					__typename: 'User',
					address
				});
			});
		});
	
		describe('Unauthenticated', () => {
			it('should fail for unauthenticated calls - INCORRECT API SECRET', async () => {
				try {
					await unauthenticatedClient_WRONG_API_KEY.mutate({
						mutation: CREATE_USER,
						variables: { address }
					});
					throw('Should not reach this point');
				} catch (error) {
					console.log(error);
					expect(error.graphQLErrors[0].extensions.code).toEqual('UNAUTHENTICATED');
				}
			});

			it('should fail for unauthenticated calls - INVALID OR NO SIGNATURE', async () => {
				try {
					await unauthenticatedClient_INVALID_SIGNATURE.mutate({
						mutation: CREATE_USER,
						variables: { address }
					});
					throw('Should not reach this point');
				} catch (error) {
					console.log(error);
					expect(error.graphQLErrors[0].extensions.code).toEqual('UNAUTHENTICATED');
				}
			});
		});
	});
});
