const { gql } = require('apollo-server');

const mutationDefs = gql`
  extend type Mutation {
		blacklistOrg(organizationId: String, blacklist: Boolean): Organization
		starOrg(userId: String!, organizationId: String!): Organization
		unStarOrg(userId: String!, organizationId: String!): Organization!
  }
`;

module.exports = mutationDefs;