const { gql } = require('apollo-server')

const typeDefs = gql`
    type Bounty {
        tvl: Float!
        contractId: String!
        id: ID!
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
        cursor: String
    }

    type BountyConnection {
        bounties: [Bounty]
        cursor: String
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
            limit: Int!
            orderBy: String
            sortOrder: String
        ): UserConnection
    }
    type Mutation {
        createBounty(tvl: Float!, contractId: String!): Bounty!
        updateBounty(tvl: Float!, contractId: String!): BatchPayload!
        watchBounty(userAddress: String, contractId: String): User
        unWatchBounty(userAddress: String, contractId: String): User
    }
`

module.exports = typeDefs
