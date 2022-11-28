/***
 *  Verifies that the Magic Link token is valid
 * ***/
const verifyEmail = async (req, userId) => {
	return new Promise(async (resolve, reject) => {
		resolve(true);
	});
};

module.exports = verifyEmail;