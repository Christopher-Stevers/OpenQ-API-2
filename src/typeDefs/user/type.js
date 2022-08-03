const { gql } = require('apollo-server');

const typeDef = gql`
	type User {
		address: String!
		watchedBountyIds: [String]
		watchedBounties(
			after: ID
			limit: Int!
			orderBy: String
			sortOrder: String
		): BountyConnection!
		starredOrganizations: [Organization]
		starredOrganizationIds: [String]
	}

	type UserConnection {
		users: [User]
		cursor: ID
	}
`;

module.exports = typeDef;