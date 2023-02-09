const { gql } = require('apollo-server');

const queryDef = gql`
	extend type Query {
		bounty(address: String!): Bounty
		bounties(
			after: ID
			limit: PaginationInt!
			orderBy: String
			sortOrder: String
			organizationId: String
			types: [String]
			category: String
			repositoryId: String
		): Bounties
	}
`;

module.exports = queryDef;
