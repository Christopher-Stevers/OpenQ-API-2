const { gql } = require('apollo-server');

const queryDef = gql`
	extend type Query{
		organization(organizationId: String!): Organization
		organizations(organizationIds: [String]!): [Organization]
	}
`;


module.exports = queryDef;