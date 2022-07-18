const { gql } = require('apollo-server');

const mutationDefs = gql`
  extend type Mutation {
		updatePrices(priceObj: JSON!, pricesId: String!): Prices!
  }
`;

module.exports = mutationDefs;