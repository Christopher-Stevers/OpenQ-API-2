const { gql } = require('apollo-server');

const queryDef = gql`
	extend type Query {
		bounty(address: String!): Bounty
		bounties(
			after: ID
			limit: Int!
			orderBy: String
			sortOrder: String
			organizationId: String
			types: [String]
			category: String
		): Bounties
	}
`;

module.exports = queryDef;
