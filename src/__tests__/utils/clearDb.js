const { MongoClient } = require('mongodb');
var url = 'mongodb://root:root@mongo:27018/openqdb?authSource=admin';

// URL for connecting from OUTSIDE the docker-compose environment
// mongodb://root:root@localhost:27018/openqdb?authSource=admin

const clearDb = async () => {
	const promise = new Promise((resolve, reject) => {
		MongoClient
			.connect(url, function (err, db) {
				if (err) throw err;
				var dbo = db.db('openqdb');
				try {
					dbo.dropCollection('Bounty', function (err, delOK) {
						if (err) throw err;
						dbo.dropCollection('Repository', function (err, delOK) {
							if (err) throw err;
							dbo.dropCollection('Organization', function (err, delOK) {
								if (err) throw err;
								db.close();
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
	return promise;
};

const clearDbUser = async () => {
	const promise = new Promise((resolve, reject) => {
		MongoClient
			.connect(url, function (err, db) {
				if (err) throw err;
				var dbo = db.db('openqdb');
				try {
					dbo.dropCollection('User', function (err, delOK) {
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
					dbo.dropCollection('Organization', function (err, delOK) {
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