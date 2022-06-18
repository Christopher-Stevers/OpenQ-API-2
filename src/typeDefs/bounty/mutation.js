const { gql } = require('apollo-server');

const mutationDefs = gql`
  extend type Mutation {
		createBounty(address: String, organizationId: String, bountyId: String): Bounty!
		updateBounty(
			address: String!
			tvl: Float!
			organizationId: String
		): Bounty!
		watchBounty(userAddress: String, contractAddress: String): User
		unWatchBounty(userAddress: String, contractAddress: String): User
  }
`;

module.exports = mutationDefs;