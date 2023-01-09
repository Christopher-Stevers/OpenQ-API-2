const { gql } = require('apollo-server');

const typeDef = gql`
	type PermissionedOrganization {
		id: String!
		name: String!		
		avatarUrl: String	
		ownerUsers(
			after: ID
			limit: Int!
			orderBy: String
			sortOrder: String): Users
		adminUsers(
			after: ID
			limit: Int!
			orderBy: String
			sortOrder: String): Users
		memberUsers(
			after: ID
			limit: Int!
			orderBy: String
			sortOrder: String): Users
		permissionedProducts(
			after: ID
			limit: Int!
			orderBy: String
			sortOrder: String): Products
	}
	
	type PermissionedOrganizations {
		permissionedOrganizationConnection: PermissionedOrganizationConnection
		nodes: [PermissionedOrganization]
	}

	type PermissionedOrganizationConnection {
		nodes:[PermissionedOrganization]
		cursor: ID
	}
`;

module.exports = typeDef;