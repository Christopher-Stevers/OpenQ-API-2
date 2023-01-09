const { gql } = require('apollo-server');

const typeDef = gql`
	type ProAccount {
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