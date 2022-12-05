const { MongoClient } = require('mongodb');
var url = 'mongodb://root:root@mongo:27018/openqdb?authSource=admin';

// URL for connecting from OUTSIDE the docker-compose environment
// mongodb://root:root@localhost:27018/openqdb?authSource=admin

const clearDb = async () => {
	const promise = new Promise((resolve, reject) => {
		MongoClient
			.connect(url, async function (err, db) {
				if (err) throw err;
				var dbo = db.db('openqDB');
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

const clearDbUser = async () => {
	const promise = new Promise((resolve, reject) => {
		MongoClient
			.connect(url, function (err, db) {
				if (err) throw err;
				var dbo = db.db('openqdb');
				try {
					dbo.dropCollection('User', function (err) {
						if (err) throw err;
						db.close();
						resolve('true');
					});
				} catch (error) {
					console.log('error', error);
					reject(error);
				}
			});
	});
	return promise;
};

const clearDbOrganization = async () => {
	const promise = new Promise((resolve, reject) => {
		MongoClient
			.connect(url, function (err, db) {
				if (err) throw err;
				var dbo = db.db('openqdb');
				try {
					dbo.dropCollection('Organization', function (err) {
						if (err) throw err;
						db.close();
						resolve('true');
					});
				} catch (error) {
					console.log('error', error);
					reject(error);
				}
			});
	});
	return promise;
};

module.exports = { clearDb, clearDbUser, clearDbOrganization };