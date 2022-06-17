const { gql } = require('apollo-server');

const queryDef = gql`
	extend type Query {
		usersConnection(
			after: ID
			limit: Int
			orderBy: String
			sortOrder: String
		): UserConnection
		user(address: String!): User
	}
`;


module.exports = queryDef;