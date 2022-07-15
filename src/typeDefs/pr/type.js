const { gql } = require('apollo-server');

const typeDef = gql`
	type PR {
	prId:				ID!
    thumbnail: 		String
	contributors: 	[Contributor]
    contributorIds: [String]
    Bounty:   		Bounty
    bountyAddress: 	String
	}

`;

module.exports = typeDef;