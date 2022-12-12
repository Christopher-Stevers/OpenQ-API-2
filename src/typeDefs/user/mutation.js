const { gql } = require('apollo-server');

const mutationDefs = gql`
  extend type Mutation {
		upsertUser(email: String, github: String): User!
		updateUser(
      id: String
			github: String
			email: String
			company: String
            username: String
      city: String
      streetAddress: String
      country: String
      province: String
      discord: String
      twitter: String
      devRoles: [String]
      otherRoles: [String]
      frameworks: [String]
      languages: [String]
      postalCode: String
      invoiceNumber: Int
      billingName: String
      phoneNumber: String
      taxId: String
      vatNumber: String
      vatRate: Float
      memo: String
		): User!
  }
`;

module.exports = mutationDefs;