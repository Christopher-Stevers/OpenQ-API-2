const { gql } = require('apollo-server');

const queryDef = gql`
	extend type Query {
		request(id: String!): Request
		requests(after: ID, limit: PaginationInt!): Requests
	}
`;

module.exports = queryDef;
