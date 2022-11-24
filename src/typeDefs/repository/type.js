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
		hackathonBlacklisted: Boolean
		startDate: String
		registrationDeadline: String
		
	}
	
	type Repositories {
		repositoryConnection: RepositoryConnection
		nodes: [Repository]
	}

	type RepositoryConnection {
		nodes:[Repository]
		cursor: ID
	}
`;

module.exports = typeDef;