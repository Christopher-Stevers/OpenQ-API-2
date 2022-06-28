
const { ethers } = require('ethers');
const axios = require('axios');
const tokenMetadata = require('../../constants/local.json');
const polygonMetadata = require('../../constants/polygon-mainnet-indexable.json');



const calculateTvl = async (change, currentTvl, add) => {
	const { volume, tokenAddress } = change;
	const currentMetadata =
		tokenMetadata[
		ethers.utils.getAddress(tokenAddress)
		] ||
		polygonMetadata[tokenAddress.toLowerCase()];

	const network = 'polygon-pos';
	const url = `https://api.coingecko.com/api/v3/simple/token_price/${network}?contract_addresses=${currentMetadata.address}&vs_currencies=usd`;
	const { data } = await axios(url);
	const multiplier =
		volume / 10 ** currentMetadata.decimals;
	const price = data[currentMetadata.address.toLowerCase()] || 0;
	const changeTvl = price.usd * multiplier * (add ? 1 : -1);
	return currentTvl + changeTvl;

};


module.exports = calculateTvl;