const { gql } = require('apollo-server');

const mutationDefs = gql`
  extend type Mutation {
		updatePrices(priceObj: JSON): BatchPayload!
		createPrices(priceObj: JSON): Prices!
  }
`;

module.exports = mutationDefs;