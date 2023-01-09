const { gql } = require('apollo-server');

const queryDef = gql`
	extend type Query{
		proAccount(id: String!): ProAccount
		proAccounts(
			after: ID
			limit: Int
			orderBy: String
			sortOrder: String
		): ProAccounts
	}
`;


module.exports = queryDef;