
const { getAuthenticatedClient } = require('../utils/getClient');
const { CREATE_NEW_BOUNTY, GET_BOUNTY_BY_ID } = require('../queries');
const { MongoClient } = require('mongodb');
var url = 'mongodb://root:root@mongo:27018/openqdb?authSource=admin';

// URL for connecting from OUTSIDE the docker-compose environment
// mongodb://root:root@localhost:27018/openqdb?authSource=admin

const dotenv = require('dotenv');
dotenv.config({ path: '../../../.env.test' });

describe('Authenticated Client can create bounties', () => {
	const contractAddress = '0x8daf17asdf20c9dba35f005b6324f493785d239719d';
	const authenticatedClient = getAuthenticatedClient('secret123!', 'signature');

	// Clear the database before each test run
	afterEach(async () => {
		const promise = new Promise((resolve, reject) => {
			MongoClient
				.connect(url, function (err, db) {
					if (err) throw err;
					var dbo = db.db('openqdb');
					try {
						console.log('Dropping Bounty collection...');
						dbo.dropCollection('Bounty', function (err, delOK) {
							if (err) throw err;
							if (delOK) console.log('Bounty collection deleted');
							console.log('Dropping Repository collection...');
							dbo.dropCollection('Repository', function (err, delOK) {
								if (err) throw err;
								if (delOK) console.log('Repository collection deleted');
								console.log('Dropping Organization collection...');
								dbo.dropCollection('Organization', function (err, delOK) {
									if (err) throw err;
									if (delOK) console.log('Organization collection deleted');
									console.log('Closing DB connection...');
									db.close();
									console.log('DB Connection Closed');
									resolve('true');
								});
							});
						});
					} catch (error) {
						console.log('error', error);
						reject(error);
					}
				});
		});
		
		try {
			await promise;
		} catch (error) {
			console.log('error in afterEach', error);
		}

	});

	it('Authenticated client can create bounty', async () => {
		await authenticatedClient.mutate({
			mutation: CREATE_NEW_BOUNTY,
			variables: { address: contractAddress, organizationId: 'mdp', bountyId: 'sdf', repositoryId: 'repoId', type: '1' }
		});

		const { data } = await authenticatedClient.query({
			query: GET_BOUNTY_BY_ID,
			variables: { contractAddress }
		});

		expect(data.bounty).toMatchObject({
			'tvl': 0,
			'bountyId': 'sdf',
			'type': '1',
			'organization': {
				'id': 'mdp'
			},
			'repository': {
				'id': 'repoId'
			}
		});
	});
});
