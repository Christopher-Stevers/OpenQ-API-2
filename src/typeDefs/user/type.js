const { gql } = require('apollo-server');

const typeDef = gql`

	type User {
		id: ID!
		username: String!
		email: String			@auth
	  github: String 			
		watchedBountyIds: [String] @auth
		watchedBounties(
			after: ID
			limit: Int!
			orderBy: String
			sortOrder: String
			category: String
			types: [String]
		): Bounties! @auth
		starredOrganizations: Organizations
		starredOrganizationIds: [String]
		province: String		@auth		
 		postalCode: String 		@auth
		billingName: String 	@auth
		phoneNumber: String 	@auth
		taxId: String 			@auth
		vatNumber: String 		@auth
 		vatRate: Float		 	@auth
		memo: String           @auth
		invoiceNumber: Int           @auth
		company: String 		@auth
		city: String			@auth
		streetAddress: String	@auth
		country: String			@auth			
		twitter:String
		discord: String
		devRoles: [String]		
		frameworks: [String]
		languages: [String]
		otherRoles: [String]
	}



	type Users {
		userConnection: UserConnection
		nodes: [User]
	}

	type UserConnection {
		nodes:[User]
		cursor: ID
	}
`;

module.exports = typeDef;