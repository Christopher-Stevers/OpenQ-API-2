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
		): User!		
  }
`;

module.exports = mutationDefs;