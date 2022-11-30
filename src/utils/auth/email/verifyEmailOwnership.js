// Third Party
const axios = require('axios');

const verifyEmailOwnership = (req, email) => {
	return new Promise(async (resolve, reject) => {
		try {
			// const signatureRegex = /email_auth=\w+/;
			// const regexMatch = req.headers.cookie.match(signatureRegex);
			
			// let token;
			// if (regexMatch !== null) {
			// 	token = req.headers.cookie.match(signatureRegex)[0].slice(11);
			// }
			
			// const result = await axios
			// 	.post(
			// 		process.env.MAGIC_LINK_API_URL,
			// 		{foo: 'bar'},
			// 		{
			// 			headers: {
			// 				'Authorization': 'token ' + token,
			// 			},
			// 		}
			// 	);
			// return resolve(result);
			return resolve(true);
		} catch (error) {
			return reject(error);
		}
	});
};

module.exports = verifyEmailOwnership;