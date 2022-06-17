const { gql } = require('apollo-server');

const typeDef = gql`
	type BatchPayload {
		count: Int
	}
`;

module.exports = typeDef;