const { gql } = require('apollo-server');

const queryDef = gql`
	extend type Query{
		product(id: String!): Product
		products(id: String!): Products
	}
`;


module.exports = queryDef;