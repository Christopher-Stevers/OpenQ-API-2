const { gql } = require('apollo-server');

const typeDef = gql`
	type Submission {
	id:				ID!
    thumbnail: 		String
	users: 	[User]
    userIds: [String]
    Bounty:   		Bounty
    bountyAddress: 	String
	blacklisted: 	Boolean
	}

`;

module.exports = typeDef;