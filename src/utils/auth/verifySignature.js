const { ecdsaRecover, compareAddress } = require('../ecdsaRecover');

const verifySignature = (req, incomingAddress) => {
	const signatureRegex = /signature=\w+/;
	const signature = req.headers.cookie.match(signatureRegex)[0].slice(10);
	const address = ecdsaRecover(signature);
	if (compareAddress(address, incomingAddress)) {
		return true;
	} else {
		return false;
	}
};

module.exports = { verifySignature };