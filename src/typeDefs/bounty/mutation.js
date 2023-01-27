const { gql } = require('apollo-server');

const mutationDefs = gql`
	extend type Mutation {
		createBounty(
			address: String!
			bountyId: String!
			organizationId: String!
			type: String!
			repositoryId: String!
			category: String
			creatingUserId: String!
		): Bounty!
		updateBounty(
			address: String!
			type: String!
			tvl: Float
			tvc: Float
			organizationId: String
			bountyId: String!
			repositoryId: String
			category: String
			createdAt: String
		): Bounty!
		watchBounty(
			userId: String!
			contractAddress: String!
			email: String
			github: String
		): Bounty
		unwatchBounty(
			userId: String!
			contractAddress: String!
			email: String
			github: String
		): Bounty
		updateBountyValuation(address: String!, tvl: Float, tvc: Float): Bounty
		blacklist(bountyId: String, blacklist: Boolean): Bounty
	}
`;

module.exports = mutationDefs;
