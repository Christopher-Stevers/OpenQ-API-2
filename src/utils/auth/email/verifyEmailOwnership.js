const verifyEmailOwnership = (req, _email, magic) => {
	return new Promise(async (resolve, reject) => {
		try {
			const emailAuthRegex = /email_auth=\w+/;
			const regexMatch = req.headers.cookie.match(emailAuthRegex);

			let didToken;
			if (regexMatch === null) {
				return reject('verifyEmailOwnership failed to extract cookie');
			} else {
				didToken = req.headers.cookie.match(regexMatch)[0].slice(11);
			}
			
			try {
				await magic.token.validate(didToken);
				const { email } = await magic.users.getMetadataByToken(didToken);
				if (email !== _email) {
					return reject('Email ownership verification failed');
				} else {
					return resolve(true);
				}
			} catch (error) {
				reject(error);
			}
		} catch (error) {
			return reject(error);
		}
	});
};

module.exports = verifyEmailOwnership;
