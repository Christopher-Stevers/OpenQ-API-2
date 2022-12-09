const { gql } = require('apollo-server');

const mutationDefs = gql`
  extend type Mutation {
		addContributor(repositoryId: String!, prId: String, userId: String, address: String,  thumbnail: String): PR
		removeContributor(repositoryId: String!, prId: String, userId: String, address: String):PR
		upsertPr(prId: String, blacklisted: Boolean): PR
  }
`;

module.exports = mutationDefs;