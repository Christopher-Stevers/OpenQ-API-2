const verifyEmailOwnership = require('./verifyEmailOwnership');
const { Magic } = require('@magic-sdk/admin');

const EmailClient = {
	verifyEmail: async (req, email) => {
		return new Promise(async (resolve, reject) => {
			try {
				let magic = new Magic(process.env.MAGIC_SECRET_KEY);
				const result = await verifyEmailOwnership(req, email, magic);
				resolve(result);
			} catch (error) {
				return reject(error);
			}
		});
	},
};

module.exports = EmailClient;