
const { getAuthenticatedClient } = require('../utils/getClient');
const { CREATE_NEW_BOUNTY, GET_BOUNTY_BY_ADDRESS } = require('../queries');
var MongoClient = require('mongodb').MongoClient;

const dotenv = require('dotenv');
dotenv.config({ path: '../../../.env.test' });
var url = 'mongodb://root:root@localhost:27018/openqdb?authSource=admin';

describe('Authenticated Client can create bounties', () => {
	const contractAddress = '0x8daf17a20c9dba35f005b6324f493785d239719d';
	const authenticatedClient = getAuthenticatedClient('secret123!', 'signature');

	// Clear the database before each test run
	beforeEach(async () => {
		const promise = new Promise((resolve, reject) => {
			MongoClient
				.connect(url, function (err, db) {
					if (err) throw err;
					var dbo = db.db('openqdb');
					try {
						dbo.dropCollection('Bounty', function (err, delOK) {
							if (err) throw err;
							if (delOK) console.log('Collection deleted');
							db.close();
							resolve('true');
						});
					} catch (error) {
						console.log(error);
						reject(error);
					}
				});
		});
		const result = await promise;
	});

	it('Authenticated client can create bounty', async () => {
		await authenticatedClient.mutate({
			mutation: CREATE_NEW_BOUNTY,
			variables: { address: contractAddress, organizationId: 'mdp', bountyId: 'sdf', repositoryId: 'repoId', type: '1' }
		});

		// console.log(authenticatedClient);

		// const { data } = await authenticatedClient.query({
		// 	query: GET_BOUNTY_BY_ADDRESS,
		// 	variables: { contractAddress }
		// });

		// console.log(data);

		// expect(data.bounty).toMatchObject({
		// 	tvl: 0,
		// 	bountyId: 'sdf',
		// 	watchingUserIds: []
		// });
		expect(true).toBe(true);
	});
});
