const { gql } = require('apollo-server');

const typeDef = gql`
	type Organization {
		address: String!
		organizationBountyIds: [String]
		organizationBounties(
			after: ID
			limit: Int!
			orderBy: String
			sortOrder: String
		): BountyConnection!
	}
`;

module.exports = typeDef;