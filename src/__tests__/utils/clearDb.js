const { MongoClient } = require('mongodb');
var url = 'mongodb://root:root@mongo:27018/openqdb?authSource=admin';

const clearDb = async () => {
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
	return promise;
};
const clearDbUser = async () => {
	const promise = new Promise((resolve, reject) => {
		MongoClient
			.connect(url, function (err, db) {
				if (err) throw err;
				var dbo = db.db('openqdb');
				try {
					console.log('Dropping User collection...');
					dbo.dropCollection('User', function (err, delOK) {
						if (err) throw err;
						if (delOK) console.log('User collection deleted');
						db.close();
						console.log('DB Connection Closed');
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

module.exports = { clearDb, clearDbUser };