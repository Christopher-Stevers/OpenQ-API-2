const { gql } = require('apollo-server');

const typeDef = gql`
	type PR {
	prId:				ID!
    thumbnail: 		String
	contributors: 	[Contributor]
    contributorIds: [String]
    Bounty:   		Bounty
    bountyAddress: 	String
	blacklisted: 	Boolean
	}

`;

module.exports = typeDef;