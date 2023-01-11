const { gql } = require('apollo-server');

const mutationDefs = gql`
  extend type Mutation {		
		createProAccount(name: String!, userId: String!, github: String, email: String): ProAccount
		addProductToProAccount(proAccountId: String!, productId: String!): ProAccount!
		addUserToPermissionedOrgWithRole(proAccountId: String!, currentUserId: String!, targetUserId: String!, role: String!): ProAccount!
		
		
  }
`;

module.exports = mutationDefs;