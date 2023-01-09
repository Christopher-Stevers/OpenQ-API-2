const { gql } = require('apollo-server');

const typeDef = gql`
	type Product {
		id: String!
		name: String!
		avatarUrl: String
		permissionedOrganizations(
			after: ID
			limit: Int!
			orderBy: String
			sortOrder: String): Products
	}
	
	type Products {
		productConnection: ProductConnection
		nodes: [Product]
	}

	type ProductConnection {
		nodes:[Product]
		cursor: ID
	}
`;

module.exports = typeDef;