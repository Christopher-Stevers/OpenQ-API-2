const { gql } = require('apollo-server');

const mutationDefs = gql`
  extend type Mutation {
		createRepository(organizationId: String!, repositoryId: String!, bountyId: String!): Repository!
		addUserToRepository(repositoryId: String!, userId: String!): Repository!
  }
`;

module.exports = mutationDefs;