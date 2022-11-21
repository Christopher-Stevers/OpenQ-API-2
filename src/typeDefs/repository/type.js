const { gql } = require('apollo-server');

const typeDef = gql`
	type Repository {
		id: ID!
		participants: [User]
		organization: Organization
		bounties(
			after: ID
			limit: Int!
			orderBy: String
			sortOrder: String
			category: String
			types: [String]
		): Bounties
		isContest: Boolean
		startDate: String
		registrationDeadline: String
		
	}
`;

module.exports = typeDef;