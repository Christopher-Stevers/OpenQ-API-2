const { ethers } = require('ethers');
const axios = require('axios');
const tokenMetadata = require('../../constants/local.json');
const polygonMetadata = require('../../constants/polygon-mainnet-indexable.json');

const calculateTvc = async (tokenAddress, volume, add) => {
	const currentMetadata =
		tokenMetadata[
		// eslint-disable-next-line indent
		ethers.utils.getAddress(tokenAddress)
		] ||
		polygonMetadata[tokenAddress.toLowerCase()];

	const network = 'polygon-pos';
	const url = `https://api.coingecko.com/api/v3/simple/token_price/${network}?contract_addresses=${currentMetadata.address}&vs_currencies=usd`;
	const { data } = await axios(url);
	const multiplier = parseInt(volume) / Math.pow(10, currentMetadata.decimals);

	const price = data[currentMetadata.address.toLowerCase()] || 0;
	const changeTvc = price.usd * multiplier * (add ? 1 : -1);
	return changeTvc;
};


module.exports = calculateTvc;