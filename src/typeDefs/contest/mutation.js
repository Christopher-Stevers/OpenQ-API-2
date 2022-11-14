const { gql } = require('apollo-server');

const mutationDefs = gql`
  extend type Mutation {
		createContest(organizationId: String!, repositoryId: String!, bountyId: String!): Contest!
  }
`;

module.exports = mutationDefs;