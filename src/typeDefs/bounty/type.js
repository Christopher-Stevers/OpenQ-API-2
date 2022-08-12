const { gql } = require('apollo-server');

const typeDef = gql`
	type Bounty {
		tvl: Float
		type: String
		blacklisted: Boolean
		address: String!
		views: Int
		bountyId: String!
		organization: Organization
		organizationId: String
	}

	type BountyConnection {
		bounties: [Bounty]
		cursor: ID
	}
`;

module.exports = typeDef;