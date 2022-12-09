const verifyEmailOwnership = require('./verifyEmailOwnership');

class EmailClient {
	constructor(magic) {
		this.magic = magic;
	}

	verifyEmail(req, email) {
		return new Promise(async (resolve, reject) => {
			try {
				const result = await verifyEmailOwnership(req, email, this.magic);
				resolve(result);
			} catch (error) {
				return reject(error);
			}
		});
	}
}

module.exports = EmailClient;