const { gql } = require('apollo-server');

const queryDef = gql`
	extend type Query {
		contest(id: String!): Contest
		contests(
			after: ID
			limit: Int!
			orderBy: String
			sortOrder: String
			organizationId: String
		): Contests
	}
`;

module.exports = queryDef;
