const { gql } = require('apollo-server');

const typeDef = gql`
	type ProAccount {
		id: String! @hasRoles(roles: [ "MEMBER"])
		name: String!		@hasRoles(roles: [ "MEMBER"])
		avatarUrl: String	@hasRoles(roles: [ "MEMBER"])
		ownerUsers(
			after: ID
			limit: Int!
			orderBy: String
			sortOrder: String): Users  @hasRoles(roles: ["OWNER", "ADMIN", "MEMBER"])
		adminUsers(
			after: ID
			limit: Int!
			orderBy: String
			sortOrder: String): Users @hasRoles(roles: ["OWNER", "ADMIN", "MEMBER"])
		memberUsers(
			after: ID
			limit: Int!
			orderBy: String
			sortOrder: String): Users @hasRoles(roles: ["OWNER", "ADMIN", "MEMBER"])
		permissionedProducts(
			after: ID
			limit: Int!
			orderBy: String
			sortOrder: String): Products  @hasRoles(roles: ["OWNER", "ADMIN", "MEMBER"])
	}
	
	type ProAccounts {
		proAccountConnection: ProAccountConnection
		nodes: [ProAccount]
	}

	type ProAccountConnection {
		nodes:[ProAccount]
		cursor: ID
	}
`;

module.exports = typeDef;