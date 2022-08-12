const { gql } = require('apollo-server');

const queryDef = gql`

directive @auth(
  requires: String,
) on FIELD_DEFINITION
	extend type Query {
		usersConnection(
			after: ID
			limit: Int
			orderBy: String
			sortOrder: String
		): UserConnection
		user(address: String!): User
		other: String
	}
`;


module.exports = queryDef;