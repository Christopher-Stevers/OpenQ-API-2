const { gql } = require('apollo-server');

const queryDef = gql`
	extend type Query {
		repository(id: String!): Repository
		repositories(
			after: ID
			limit: Int!
			orderBy: String
			sortOrder: String
			organizationId: String
		): Repositories
	}
`;

module.exports = queryDef;
