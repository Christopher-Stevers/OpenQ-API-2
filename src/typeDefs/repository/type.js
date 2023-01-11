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
		registrationDeadline: String		
   		eventOrganizer:      String
    	repositoryUrl:      String
    	isIrl:      Boolean
    	city:      String
    	timezone:      String
    	startDate:      String
    	endDate:      String
    	topic:      [String]
    	website:      String
    	contactEmail:      String
    	twitter:      String
    	discord:      String
    	telegram:      String
    	slack:      String
		
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