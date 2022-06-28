const { gql } = require('apollo-server');

const mutationDefs = gql`
  extend type Mutation {
		createBounty(address: String!, bountyId: String!, organizationId: String!): Bounty!
		updateBounty(address: String!, tvl: Float!, organizationId: String, bountyId: String!): Bounty!
		watchBounty(userAddress: String, contractAddress: String): User
		unWatchBounty(userAddress: String, contractAddress: String): User
		addToTvl(address: String, tokenBalance: JSON, add: Boolean): Bounty
  }
`;

module.exports = mutationDefs;