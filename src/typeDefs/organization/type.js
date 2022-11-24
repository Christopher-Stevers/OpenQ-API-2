const { gql } = require('apollo-server');

const typeDef = gql`
	type Organization {
		id: String!
		blacklisted: Boolean
		starringUserIds: [String]
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
		): Repositories
	}
`;

module.exports = typeDef;