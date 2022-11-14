const { gql } = require('apollo-server');

const typeDef = gql`
	type Contest {
		id: ID!
		participants: [User]
		organization: Organization
		bounties: [Bounty]
	}
	type Contests {
		contestConnection: ContestsConnection
		nodes: [Contest]
	}
	type ContestsConnection {
		nodes:[Contest]
		cursor: ID
	}
`;

module.exports = typeDef;