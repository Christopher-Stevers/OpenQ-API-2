const { gql } = require('apollo-server');

const queryDef = gql`
	extend type Query{
		prices: [Prices]
	}
`;

module.exports = queryDef;