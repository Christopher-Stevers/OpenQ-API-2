const ethers = require('ethers');

function ecdsaRecover(signature) {
	let message = 'OpenQ';
	try {
		const recoveredAddress = ethers.utils.verifyMessage(message, signature);
		return recoveredAddress;
	} catch (err) {
		return false;
	}
}

const compareAddress = (addr1, addr2) => {
	return addr1.toLowerCase() === addr2.toLowerCase();
};

module.exports = { ecdsaRecover, compareAddress };