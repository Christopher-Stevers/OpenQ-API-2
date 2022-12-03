const { Magic } = require('@magic-sdk/admin');

const verifyEmailOwnership = (req, email) => {
	return new Promise(async (resolve, reject) => {
		const magic = new Magic(process.env.MAGIC_SECRET_KEY);
		try {
			const emailAuthRegex = /email_auth=\w+/;
			const regexMatch = req.headers.cookie.match(emailAuthRegex);
			
			let didToken;
			if (regexMatch !== null) {
				didToken = req.headers.cookie.match(emailAuthRegex)[0].slice(11);
			}

			await magic.token.validate(didToken);

			return resolve(true);
		} catch (error) {
			return reject(error);
		}
	});
};

module.exports = verifyEmailOwnership;