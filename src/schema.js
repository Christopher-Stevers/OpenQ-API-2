const { gql } = require('apollo-server');

const typeDefs = gql`
	type PullRequest {
		url: String!
		author: String!
		mergedAt: Date!
	}

	scalar Date

	input PullRequestInput {
		url: String!
		author: String!
		mergedAt: Date!
	}

	type Bounty {
		tvl: Float!
		contractAddress: String!
		id: ID!
		claimantPullRequest: PullRequest
		watchingUserIds: [String]
		watchingUsers(
			after: ID
			limit: Int!
			orderBy: String
			sortOrder: String
		): UserConnection!
	}
	type User {
		id: ID
		userAddress: String!
		watchedBountyIds: [String]
		watchedBounties(
			after: ID
			limit: Int!
			orderBy: String
			sortOrder: String
		): BountyConnection!
	}

	type UserConnection {
		users: [User]
		cursor: ID
	}

	type BountyConnection {
		bounties: [Bounty]
		cursor: ID
	}

	type BatchPayload {
		count: Long!
	}
	scalar Long

	type Query {
		bountiesConnection(
			after: ID
			limit: Int!
			orderBy: String
			sortOrder: String
		): BountyConnection
		usersConnection(
			after: ID
			limit: Int
			orderBy: String
			sortOrder: String
		): UserConnection
		bounty(contractAddress: String!): Bounty
		user(userAddress: String!): User
	}
	type Mutation {
		createBounty(tvl: Float!, contractAddress: String!): Bounty!
		updateBounty(tvl: Float!, contractAddress: String!): BatchPayload!
		watchBounty(userAddress: String, contractAddress: String): User
		unWatchBounty(userAddress: String, contractAddress: String): User
	}
`;

module.exports = typeDefs;
