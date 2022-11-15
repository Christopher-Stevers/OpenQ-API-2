const { gql } = require('apollo-server');

const mutationDefs = gql`
  extend type Mutation {
		createRepository(organizationId: String!, repositoryId: String!, bountyId: String!): Repository!
  }
`;

module.exports = mutationDefs;