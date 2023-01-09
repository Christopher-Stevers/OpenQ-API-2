const { gql } = require('apollo-server');

const queryDef = gql`
	extend type Query{
		permissionedOrganization(id: String!): PermissionedOrganization
		permissionedOrganizations(
			after: ID
			limit: Int
			orderBy: String
			sortOrder: String
		): PermissionedOrganizations
	}
`;


module.exports = queryDef;