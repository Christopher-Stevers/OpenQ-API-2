const { gql } = require('apollo-server');

const mutationDefs = gql`
  extend type Mutation {
		createRequest(bountyAddress: String, requestingUserId: String ): Request
		
  }
`;

module.exports = mutationDefs;