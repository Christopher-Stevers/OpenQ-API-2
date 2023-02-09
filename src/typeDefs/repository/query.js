const { gql } = require('apollo-server');

const queryDef = gql`
	extend type Query {
		repository(id: String!): Repository
		repositories(
			after: ID
			limit: PaginationInt!
			orderBy: String
			sortOrder: String
			organizationId: String
		): [Repository]
	}
`;

module.exports = queryDef;
