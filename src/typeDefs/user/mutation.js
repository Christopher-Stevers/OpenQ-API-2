const { gql } = require('apollo-server');

const mutationDefs = gql`
  extend type Mutation {
		updateUser(
			address: String!
			company: String
			email: String
			city: String
			streetAddress: String
			country: String
			province: String
			github: String
			twitter:String
			discord: String
			devRoles: [String]
			frameworks: [String]
			languages: [String]
			otherRoles: [String]
		): User!
		updateUserSimple(
			address: String!
			email: String		
			twitter:String
			languages: [String]
			github: String)	: User!
		updateUserGithubWithAddress(
			github: String!
			address: String!): User!	
  }
`;

module.exports = mutationDefs;