const { gql } = require('apollo-server');

const mutationDefs = gql`
  extend type Mutation {
		createProduct(name: String!): Product
		updateProduct(name: String!, id: String!): Product
		deleteProduct(name: String!): Product
  }
`;

module.exports = mutationDefs;