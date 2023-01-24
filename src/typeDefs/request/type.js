const { gql } = require('apollo-server');

const typeDef = gql`
	type Request {
	bounty: Bounty
	message: String
	requestingUser: User
	id: ID!
	}
	
	type Requests {
		requestConnection: RequestConnection
		nodes: [Request]
	}

	type RequestConnection {
		nodes:[Request]
		cursor: ID
	}
`;

module.exports = typeDef;