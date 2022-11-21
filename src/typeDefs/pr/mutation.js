const { gql } = require('apollo-server');

const mutationDefs = gql`
  extend type Mutation {
		createPr(thumbnail: String, prId: String!, bountyAddress: String!): PR!
		updatePr(thumbnail: String, contributorIds: [String], prId: String!
		): PR!
		addContributor(prId: String, userId: String, address: String,  thumbnail:String): PR
		removeContributor(prId: String, userId: String, address: String):PR
		blackListPr(prId: String, blacklisted: Boolean): PR
  }
`;

module.exports = mutationDefs;