const { gql } = require('apollo-server');

const queryDef = gql`
	extend type Query{
		bountiesConnection(
			after: ID
			limit: Int!
			orderBy: String
			sortOrder: String
			organizationId: String
			views: Int,
			types: [String]
		): BountyConnection
		bounty(address: String!): Bounty
		bounties(addresses: [String]!):[Bounty]
	}
`;


module.exports = queryDef;