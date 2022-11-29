const { gql } = require('apollo-server');

const mutationDefs = gql`
  extend type Mutation {
		upsertUser(email: String, github: String): User!
  }
`;

module.exports = mutationDefs;