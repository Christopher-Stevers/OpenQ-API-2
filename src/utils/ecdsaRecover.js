const ethers = require('ethers');

function ecdsaRecover(signature) {
	let message = 'OpenQ';
	try {
		const recoveredAddress = ethers.utils.verifyMessage(message, signature);
		return recoveredAddress;
	}
	catch (err) {
		return false;
	}
}

module.exports = ecdsaRecover;