const { gql } = require('apollo-server');

const typeDef = gql`
	type Organization {
		id: String!
		organizationBountyIds: [String]
		blacklisted: Boolean
		starringUserIds: [String]
		organizationBounties(
			after: ID
			limit: Int!
			orderBy: String
			sortOrder: String
		): BountyConnection!
	}
`;

module.exports = typeDef;