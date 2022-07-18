const { gql } = require('apollo-server');

const typeDef = gql`
	type Prices {
		timestamp: Float!
		priceObj: JSON!
		id: ID!
		pricesId: String!
	}
`;

module.exports = typeDef;