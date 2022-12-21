const { gql } = require('apollo-server');

const queryDef = gql`
	extend type Query{
		submission(id: String!): Submission
		submissions(ids: [String]): [Submission]
	}
`;


module.exports = queryDef;