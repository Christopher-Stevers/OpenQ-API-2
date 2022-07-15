const { gql } = require('apollo-server');

const typeDef = gql`
	type Bounty {
		tvl: Float
		blacklisted: Boolean
		address: String!
		views: Int
		bountyId: String!
		watchingUserIds: [String]
		organization: Organization
		organizationId: String
		watchingUsers(
			after: ID
			limit: Int!
			orderBy: String
			sortOrder: String
		): UserConnection!
	}

	type BountyConnection {
		bounties: [Bounty]
		cursor: ID
	}
`;

module.exports = typeDef;