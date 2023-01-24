const { gql } = require('apollo-server');

const typeDef = gql`
	type Bounty {
		tvc: Float
		tvl: Float
		type: String
		blacklisted: Boolean
		address: String!
		views: Int
		watchingCount: Int
		bountyId: String!
		watchingUsers: [User]
		organization: Organization
		organizationId: String
		category: String
		createdAt: String
		repositoryId: String
		repository: Repository
		request: Request
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