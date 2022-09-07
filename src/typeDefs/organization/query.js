const { gql } = require('apollo-server');

const queryDef = gql`
	extend type Query{
		organization(organizationId: String!): Organization
		organizations(organizationIds: [String], category: String, types: [String]): [Organization]
	}
`;


module.exports = queryDef;