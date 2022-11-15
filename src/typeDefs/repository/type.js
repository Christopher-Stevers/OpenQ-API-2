const { gql } = require('apollo-server');

const typeDef = gql`
	type Repository {
		id: ID!
		participants: [User]
		organization: Organization
		bounties: [Bounty]
	}
	type Repositories {
		repositoryConnection: RepositoriesConnection
		nodes: [Repository]
	}
	type RepositoriesConnection {
		nodes:[Repository]
		cursor: ID
	}
`;

module.exports = typeDef;