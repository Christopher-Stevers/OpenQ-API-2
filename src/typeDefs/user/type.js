const { gql } = require('apollo-server');

const typeDef = gql`
	type User {
		address: String!		@auth
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
		email: String			@auth
		city: String			@auth
		streetAddress: String	@auth
		country: String			@auth	
		province: String		@auth		
 		postalCode: String 		@auth
  		billingName: String 	@auth
  		phoneNumber: String 	@auth
  		taxId: String 			@auth
		vatNumber: String 		@auth
 		vatRate: Float		 	@auth
  		memo: String           @auth
  		invoiceNumber: Int           @auth
		github: String 			
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