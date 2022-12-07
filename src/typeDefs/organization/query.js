const { gql } = require('apollo-server');

const queryDef = gql`
	extend type Query{
		organization(organizationId: String!): Organization
		organizations(
			after: ID
			limit: Int
			orderBy: String
			sortOrder: String
		): Organizations
	}
`;


module.exports = queryDef;