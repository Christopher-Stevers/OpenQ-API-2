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
		): User!
		updateUserSimple(
			address: String!
			email: String		
			github: String)	: User!
  }
`;

module.exports = mutationDefs;