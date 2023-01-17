const verifyEmailOwnership = require('./verifyEmailOwnership');
const getEmailFromCookie = require('./getEmailFromCookie');

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
	getEmail(req) {
		return new Promise(async (resolve, reject) => {
			try {
				const result = await getEmailFromCookie(req,  this.magic);
				resolve(result);
			} catch (error) {
				return reject(error);
			}
		

		
		});
	}



	

}

module.exports = EmailClient;