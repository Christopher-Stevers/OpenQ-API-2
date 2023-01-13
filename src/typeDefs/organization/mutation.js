const { gql } = require('apollo-server');

const mutationDefs = gql`
  extend type Mutation {
		blacklistOrg(organizationId: String, blacklist: Boolean): Organization
		starOrg(userId: String!, organizationId: String!, email: String, github: String): Organization @auth
		unstarOrg(userId: String!, organizationId: String!, email: String, github: String): Organization! @auth
  }
`;

module.exports = mutationDefs;