const { gql } = require('apollo-server');

const queryDef = gql`
	extend type Query {
		request(id: String!): Request
		requests(
			after: ID
			limit: Int!
		): Requests
	}
`;

module.exports = queryDef;
