const { gql } = require('@apollo/client');

const UPDATE_BOUNTY = gql`
	mutation Mutation($address: String!, $tvl: Float!) {
		updateBounty(address: $address, tvl: $tvl) {
			count
		}
	}
`;

module.exports = UPDATE_BOUNTY;
