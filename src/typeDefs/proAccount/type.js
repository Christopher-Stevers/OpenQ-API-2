const { gql } = require('apollo-server');

const typeDef = gql`
	type ProAccount {
		id: String! @auth
		name: String!		
		avatarUrl: String	
		ownerUsers(
			after: ID
			limit: Int!
			orderBy: String
			sortOrder: String): Users  @auth(roles: ["OWNER"])
		adminUsers(
			after: ID
			limit: Int!
			orderBy: String
			sortOrder: String): Users  @auth(roles: ["OWNER", "ADMIN"])
		memberUsers(
			after: ID
			limit: Int!
			orderBy: String
			sortOrder: String): Users @auth(roles: ["OWNER", "ADMIN", "MEMBER"])
		permissionedProducts(
			after: ID
			limit: Int!
			orderBy: String
			sortOrder: String): Products  @auth(roles: ["OWNER", "ADMIN"])
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