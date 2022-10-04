const { gql } = require('apollo-server');

const queryDef = gql`
	extend type Query{
		organization(organizationId: String!): Organization
		organizations(organizationIds: [String], types: [String], category: String): [Organization]
	}
`;


module.exports = queryDef;