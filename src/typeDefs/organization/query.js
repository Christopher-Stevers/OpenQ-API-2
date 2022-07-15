const { gql } = require('apollo-server');

const queryDef = gql`
	extend type Query{
		organization(organizationId: String!): Organization
	}
`;


module.exports = queryDef;