const { gql } = require('apollo-server');

const mutationDefs = gql`
  extend type Mutation {
		updatePrices(priceObj: JSON): Prices!
  }
`;

module.exports = mutationDefs;