const { gql } = require('apollo-server');

const mutationDefs = gql`
  extend type Mutation {
		blackListOrg(organizationId: String, blackList: Boolean): Organization
		starOrg(address: String, id: String): Organization
		unStarOrg(address: String!, id: String!): Organization!
  }
`;

module.exports = mutationDefs;