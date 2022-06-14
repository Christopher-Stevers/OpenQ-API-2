const { gql } = require('@apollo/client');

const UPDATE_BOUNTY = gql`
	mutation Mutation($address: String!, $tvl: Float!) {
		updateBounty(address: $address, tvl: $tvl) {
			address
		}
	}
`;

module.exports = UPDATE_BOUNTY;
