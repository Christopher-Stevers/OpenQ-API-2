const { gql } = require('apollo-server');

const typeDef = gql`
	type Contributor {	
    userId:		String
    address: 	String
    prs:    	[PR]
    prIds:  	[String]
	}

`;

module.exports = typeDef;