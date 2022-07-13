const { gql } = require('apollo-server');

const mutationDefs = gql`
  extend type Mutation {
		createBounty(address: String!, bountyId: String!, organizationId: String!): Bounty!
		updateBounty(
			address: String!
			tvl: Float!
			organizationId: String
			bountyId: String!
		): Bounty!
		addView(address: String): Bounty
		watchBounty(userAddress: String, contractAddress: String): Bounty
		unWatchBounty(userAddress: String, contractAddress: String): Bounty
		addToTvl(address: String, tokenBalance: JSON, add: Boolean): Bounty
  }
`;

module.exports = mutationDefs;