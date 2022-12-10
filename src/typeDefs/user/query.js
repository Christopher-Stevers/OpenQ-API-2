const { gql } = require('apollo-server');

const queryDef = gql`

	extend type Query {
		users(
			after: ID
			limit: Int
			orderBy: String
			sortOrder: String
		): Users
		user(id: String, email: String, github: String): User
		other: String
	}
`;


module.exports = queryDef;