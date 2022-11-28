const { gql } = require('apollo-server');

const typeDef = gql`
	type User {
		id: ID!
		email: String			@auth
	  github: String 			@auth
		address: String		@auth
		watchedBountyIds: [String] @auth
		watchedBounties(
			after: ID
			limit: Int!
			orderBy: String
			sortOrder: String
			category: String
			types: [String]
		): Bounties! @auth
		starredOrganizations: [Organization]
		starredOrganizationIds: [String]
		company: String 		@auth
		city: String			@auth
		streetAddress: String	@auth
		country: String			@auth	
		province: String		@auth
		twitter:String
		discord: String
		devRoles: [String]		
		frameworks: [String]
		languages: [String]
		otherRoles: [String]
	}

	type UserConnection {
		users: [User]
		cursor: ID
	}
`;

module.exports = typeDef;