const { gql } = require('apollo-server');

const queryDef = gql`
	extend type Query{
		pr(prId: String!): PR
	}
`;


module.exports = queryDef;