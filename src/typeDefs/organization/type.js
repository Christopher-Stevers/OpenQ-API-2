const { gql } = require('apollo-server');

const typeDef = gql`
	type Organization {
		id: String!
		blacklisted: Boolean
		starringUsers(
			after: ID
			limit: PaginationInt!
			orderBy: String
			sortOrder: String
		): Users
		bounties(
			after: ID
			limit: PaginationInt!
			orderBy: String
			sortOrder: String
			category: String
			types: [String]
		): Bounties
		repositories(
			after: ID
			limit: PaginationInt!
			orderBy: String
			sortOrder: String
			category: String
			types: [String]
		): Repositories
	}

	type Organizations {
		organizationConnection: OrganizationConnection
		nodes: [Organization]
	}

	type OrganizationConnection {
		nodes: [Organization]
		cursor: ID
	}
`;

module.exports = typeDef;
