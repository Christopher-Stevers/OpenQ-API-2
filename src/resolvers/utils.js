const { ecdsaRecover, compareAddress } = require('../utils/ecdsaRecover');

const verifySignature = (req, args) => {
	const signatureRegex = /signature=\w+/;
	const signature = req.headers.cookie.match(signatureRegex)[0].slice(10);
	const address = ecdsaRecover(signature);
	if (!compareAddress(address, args.userAddress)) {
		return false;
	} else {
		return true;
	}
};

module.exports = { verifySignature };