const verifyGithubOwnership = require('./verifyGithubOwnership');

const GithubClient = {
	verifyGithub: async (req, email) => {
		return new Promise(async (resolve, reject) => {
			try {
				const result = await verifyGithubOwnership(req, email);
				resolve(result);
			} catch (error) {
				return reject(error);
			}
		});
	},
};

module.exports = GithubClient;