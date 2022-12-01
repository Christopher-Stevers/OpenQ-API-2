const { gql } = require('apollo-server');

const typeDef = gql`
	type Organization {
		id: String!
		blacklisted: Boolean
		starringUsers: [User]
		bounties(
			after: ID
			limit: Int!
			orderBy: String
			sortOrder: String
			category: String
			types: [String]
		): Bounties
		repositories(
			after: ID
			limit: Int!
			orderBy: String
			sortOrder: String
			category: String
			types: [String]
		): [Repository]
	}
`;

module.exports = typeDef;