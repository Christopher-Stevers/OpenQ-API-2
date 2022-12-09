const { MongoClient } = require('mongodb');
var url = 'mongodb://root:root@mongo:27018/openqdb?authSource=admin';

// URL for connecting from OUTSIDE the docker-compose environment
// mongodb://root:root@localhost:27018/openqdb?authSource=admin

const clearDb = async () => {
	const promise = new Promise((resolve, reject) => {
		MongoClient
			.connect(url, async function (err, db) {
				if (err) throw err;
				var dbo = db.db('openqdb');
				try {
					dbo.dropDatabase().then(async () => {
						await db.close().then(() => {
							resolve('true');
						});
					});
				}
				catch (error) {
					reject('Failed to clear database', error);
				}
			});
	});
	return promise;
};

module.exports = { clearDb };