const { gql } = require('apollo-server');

const typeDef = gql`
	type Organization {
		id: String!
		organizationBountyIds: [String]
		blacklisted: Boolean
		starringUserIds: [String]
		bounties(
			after: ID
			limit: Int!
			orderBy: String
			sortOrder: String
			category: String
		): Bounties
	}
`;

module.exports = typeDef;