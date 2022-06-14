const axios = require('axios');
const fetch = require('cross-fetch');
const { ethers } = require('ethers');
const { ApolloClient, InMemoryCache, HttpLink } = require('@apollo/client');
const UPDATE_BOUNTY = require('./graphql/updateBounty');
const GET_ALL_BOUNTIES = require('./graphql/getAllBounties');
const tokenMetadata = require('../constants/local.json');
const polygonMetadata = require('../constants/polygon-mainnet-indexable.json');

const tvlClient = new ApolloClient({
	cache: new InMemoryCache(),
	link: new HttpLink({
		fetch,
		uri: `${process.env.OPENQ_API_URL}`,
	}),
});

const subGraphClient = new ApolloClient({
	cache: new InMemoryCache(),
	link: new HttpLink({
		fetch,
		uri: `${process.env.OPENQ_SUBGRAPH_HTTP_URL}`,
		defaultOptions: {
			query: {
				fetchPolicy: 'no-cache',
			},
		},
	}),
});

// Same as in OpenQSubgraphClient
const fetchBounties = async () => {
	const getBounties = async (sortOrder, startAt, quantity) => {
		try {
			const result = await subGraphClient.query({
				query: GET_ALL_BOUNTIES,
				fetchPolicy: 'no-cache',
				variables: { skip: startAt, sortOrder, quantity },
			});
			return result.data.bounties.filter(
				(bounty) =>
					bounty.bountyId.slice(0, 1) === 'I' ||
					bounty.bountyId.slice(0, 1) === 'M'
			);
		} catch (e) {
			console.log(e);
		}
		return [];
	};

	const bounties = [];
	const pricingMetadata = [];

	// Recursive function in case we need multiple pages of bounties.
	const getAllBounties = async () => {
		const batch = await getBounties('asc', 0, 100);
		batch.forEach((bounty) => {
			bounty.bountyTokenBalances.forEach((bountyTokenBalance) => {
				if (
					!pricingMetadata.includes(
						bountyTokenBalance.tokenAddress
					) &&
					tokenMetadata[
					ethers.utils.getAddress(bountyTokenBalance.tokenAddress)
					]
				) {
					pricingMetadata.push(
						tokenMetadata[
						ethers.utils.getAddress(
							bountyTokenBalance.tokenAddress
						)
						]
					);
				} else if (
					polygonMetadata[
					bountyTokenBalance.tokenAddress.toLowerCase()
					]
				) {
					pricingMetadata.push(
						polygonMetadata[
						bountyTokenBalance.tokenAddress.toLowerCase()
						]
					);
				}
			});
		});
		bounties.push(...batch);
		if (batch === 100) {
			await getAllBounties();
		}
	};

	await getAllBounties();

	// Get token values
	const network = 'polygon-pos';
	const url = `https://api.coingecko.com/api/v3/simple/token_price/${network}?contract_addresses=${pricingMetadata
		.map((metadata) => metadata.address)
		.join(',')}&vs_currencies=usd`;
	const { data } = await axios.get(url);
	// Attach USD values to addresses
	const tvls = bounties.map((bounty) => {
		const tvl = bounty.bountyTokenBalances.reduce(
			(accum, tokenBalance) => {
				if (!accum) {
					return tokenBalance;
				}

				const currentMetadata =
					tokenMetadata[
					ethers.utils.getAddress(tokenBalance.tokenAddress)
					] ||
					polygonMetadata[tokenBalance.tokenAddress.toLowerCase()];

				const multiplier =
					tokenBalance.volume / 10 ** currentMetadata.decimals;
				const price = data[currentMetadata.address.toLowerCase()] || 0;
				return price.usd * multiplier + parseFloat(accum);
			},
			[0]
		);
		return { address: bounty.bountyAddress, tvl };
	});
	return tvls;
};
const updateTvls = async (values) => {
	const pending = [];
	for (let i = 0; i < values.length; i += 1) {
		const value = values[i];
		const address = ethers.utils.getAddress(value.address);
		const tvl = parseFloat(value.tvl);
		const result = tvlClient.mutate({
			mutation: UPDATE_BOUNTY,
			variables: { address, tvl },
		});
		pending.push(result);
	}
	return Promise.all(pending);
};
const indexer = async () => {
	const TVLS = await fetchBounties();
	await updateTvls(TVLS);
};

module.exports = indexer;
