const { gql } = require('apollo-server');

const mutationDefs = gql`
  extend type Mutation {
		addUserToSubmission(repositoryId: String!, submissionId: String, userId: String,  thumbnail: String): Submission
		removeUserFromSubmission( submissionId: String, userId: String):Submission
		upsertSubmission(repositoryId: String!, submissionId: String, blacklisted: Boolean): Submission
  }
`;

module.exports = mutationDefs;