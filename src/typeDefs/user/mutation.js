const { gql } = require('apollo-server');

const mutationDefs = gql`
  extend type Mutation {
		upsertUser(email: String, github: String): User!
		updateUser(
      id: String
			github: String
			email: String
			company: String
      city: String
      streetAddress: String
      country: String
      province: String
      discord: String
      twitter: String
      devRoles: String
      frameworks: String
      languages: String
      otherRoles: String
      postalCode: String
      invoiceNumber: String
      billingName: String
      phoneNumber: String
      taxId: String
      vatNumber: String
      vatRate: String
      memo: String
		): User!
  }
`;

module.exports = mutationDefs;