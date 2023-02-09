const { gql } = require('apollo-server');

const typeDef = gql`
	type User {
		id: ID!
		username: String
		email: String @auth
		github: String
		createdAt: String @auth
		watchedBountyIds: [String]
		watchedBounties(
			after: ID
			limit: PaginationInt!
			orderBy: String
			sortOrder: String
			category: String
			types: [String]
		): Bounties!
		starredOrganizations: Organizations
		starredOrganizationIds: [String]
		province: String @auth
		postalCode: String @auth
		billingName: String @auth
		phoneNumber: String @auth
		taxId: String @auth
		vatNumber: String @auth
		vatRate: Float @auth
		memo: String @auth
		invoiceNumber: Int @auth
		company: String @auth
		city: String @auth
		streetAddress: String @auth
		country: String
		twitter: String
		discord: String
		devRoles: [String]
		frameworks: [String]
		languages: [String]
		otherRoles: [String]
		invoicingEmail: String @auth
		interests: [String]
		createdBounties(
			after: ID
			limit: PaginationInt!
			orderBy: String
			sortOrder: String
			category: String
			types: [String]
		): Bounties!
		requests(
			after: ID
			limit: PaginationInt!
			orderBy: String
			sortOrder: String
		): Requests
	}

	type Users {
		userConnection: UserConnection
		nodes: [User]
	}

	type UserConnection {
		nodes: [User]
		cursor: ID
	}
`;

module.exports = typeDef;
