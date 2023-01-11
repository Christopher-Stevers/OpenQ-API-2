const { gql } = require('apollo-server');

const queryDef = gql`
	extend type Query{
		product(id: String!): Product
		products(
			after: ID
			limit: Int
			orderBy: String
			sortOrder: String
		): Products
	}
`;


module.exports = queryDef;