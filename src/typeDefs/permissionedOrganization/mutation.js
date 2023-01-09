const { gql } = require('apollo-server');

const mutationDefs = gql`
  extend type Mutation {		
		createPermissionedOrganization(name: String!, userId: String!, github: String, email: String): PermissionedOrganization
		addProductToPermissionedOrganization(permissionedOrganizationId: String!, productId: String!, userId: String!): PermissionedOrganization!
		addUserToPermissionedOrgWithRole(permissionedOrganizationId: String!, currentUserId: String!, targetUserId: String!, role: String!): PermissionedOrganization!
		
		
  }
`;

module.exports = mutationDefs;