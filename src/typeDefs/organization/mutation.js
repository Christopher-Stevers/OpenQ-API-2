const { gql } = require('apollo-server');

const mutationDefs = gql`
  extend type Mutation {
		blacklistOrg(organizationId: String, blacklist: Boolean): Organization
		starOrg(userId: String!, id: String!): Organization
		unStarOrg(userId: String!, id: String!): Organization!
  }
`;

module.exports = mutationDefs;