const verifyEmailOwnership = require('./verifyEmailOwnership');

const EmailClient = {
	verifyEmail: async (req, email) => {
		return new Promise(async (resolve, reject) => {
			try {
				const result = await verifyEmailOwnership(req, email);
				resolve(result);
			} catch (error) {
				return reject(error);
			}
		});
	},
};

module.exports = EmailClient;