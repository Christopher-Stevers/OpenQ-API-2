const { gql } = require('apollo-server');

const typeDef = gql`

	type User {
		id: ID!
		username: String
		email: String			
	  github: String 			
		watchedBountyIds: [String]
		watchedBounties(
			after: ID
			limit: Int!
			orderBy: String
			sortOrder: String
			category: String
			types: [String]
		): Bounties! 
		starredOrganizations: Organizations
		starredOrganizationIds: [String]
		province: String				
 		postalCode: String 		
		billingName: String 	
		phoneNumber: String 	
		taxId: String 			
		vatNumber: String 		
 		vatRate: Float		 	
		memo: String           
		invoiceNumber: Int           
		company: String 		
		city: String			
		streetAddress: String	
		country: String						
		twitter:String
		discord: String
		devRoles: [String]		
		frameworks: [String]
		languages: [String]
		otherRoles: [String]
        invoicingEmail: String
        interests: [String]
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