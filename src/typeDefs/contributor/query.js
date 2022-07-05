const { gql } = require('apollo-server');

const queryDef = gql`
	extend type Query{
		contributor(userId: String!): Contributor
	}
`;



module.exports = queryDef;