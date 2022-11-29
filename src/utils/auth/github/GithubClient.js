const verifyGithubOwnership = require('./verifyGithubOwnership');

const GithubClient = {
	verifyGithub: async (req, github) => {
		return new Promise(async (resolve, reject) => {
			try {
				const result = await verifyGithubOwnership(req, github);
				resolve(result);
			} catch (error) {
				return reject(error);
			}
		});
	},
};

module.exports = GithubClient;