const { gql } = require('apollo-server');

const mutationDefs = gql`
  extend type Mutation {
		addContributor(prId: String, userId: String, address: String,  thumbnail:String): PR
		removeContributor(prId: String, userId: String, address: String):PR
		upsertPr(github: String, prId: String, blacklisted: Boolean): PR
  }
`;

module.exports = mutationDefs;