const { gql } = require('apollo-server');

const mutationDefs = gql`
  extend type Mutation {
		createRepository(organizationId: String!, repositoryId: String!, bountyId: String!): Repository!
		addUserToRepository(repositoryId: String!, userId: String!): Repository!
		setIsContest(repositoryId: String!, isContest: Boolean!, organizationId: String!, startDate:String!, registrationDeadline: String!): Repository!
  }
`;

module.exports = mutationDefs;