const { gql } = require('apollo-server');

const queryDef = gql`
	extend type Query{
		bounty(address: String!): Bounty
		bounties(
			after: ID
			limit: Int!
			orderBy: String
			sortOrder: String
			category: String
			organizationId: String
			):Bounties
	}
`;


module.exports = queryDef;