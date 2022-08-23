const { gql } = require('apollo-server');

const typeDef = gql`
	type Bounty {
		tvl: Float
		type: String
		blacklisted: Boolean
		address: String!
		views: Int
		watchingCount: Int
		bountyId: String!
		organization: Organization
		organizationId: String
		category: String
		createdAt: String
	}
	type Bounties {
		bountyConnection: BountyConnection
		nodes: [Bounty]
	}

	type BountyConnection {
		nodes:[Bounty]
		cursor: ID
	}
`;

module.exports = typeDef;