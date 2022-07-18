const { gql } = require('apollo-server');

const mutationDefs = gql`
  extend type Mutation {
		blackListOrg(organizationId: String, blackList: Boolean): Organization
  }
`;

module.exports = mutationDefs;