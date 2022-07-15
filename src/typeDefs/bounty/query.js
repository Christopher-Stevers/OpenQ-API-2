const { gql } = require('apollo-server');

const queryDef = gql`
	extend type Query{
		bountiesConnection(
			after: ID
			limit: Int!
			orderBy: String
			sortOrder: String
			organizationId: String
			views: Int
		): BountyConnection
		bounty(address: String!): Bounty
	}
`;


module.exports = queryDef;