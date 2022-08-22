const { gql } = require('apollo-server');

const mutationDefs = gql`
  extend type Mutation {
		createBounty(address: String!, bountyId: String!, organizationId: String!, type: String!, category: String): Bounty!
		updateBounty(
			address: String!,
			type: String!,
			tvl: Float!,
			organizationId: String,
			bountyId: String!,
			category: String
		): Bounty!
		watchBounty(userAddress: String, contractAddress: String): Bounty
		unWatchBounty(userAddress: String, contractAddress: String): Bounty
		addToTvl(address: String, tokenBalance: JSON, add: Boolean): Bounty
		blackList(bountyId: String, blackList: Boolean) : Bounty
  }
`;

module.exports = mutationDefs;