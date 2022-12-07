const { gql } = require('apollo-server');

const typeDef = gql`
	type Contributor {	
    userId:		String
    prs:    	[PR]
    prIds:  	[String]
	}

`;

module.exports = typeDef;