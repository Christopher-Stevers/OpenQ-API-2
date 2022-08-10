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
		company: String
		email: String
		city: String
		streetAddress: String
		country: String
		province: String
	}

	type UserConnection {
		users: [User]
		cursor: ID
	}
`;

module.exports = typeDef;