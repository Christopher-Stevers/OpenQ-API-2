const { gql } = require('apollo-server')

const typeDefs = gql`
    type Bounty {
        tvl: Float!
        bountyId: String!
        id: ID!
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
    }
    type Mutation {
        createBounty(tvl: Float!, bountyId: String!): Bounty!
        updateBounty(tvl: Float!, bountyId: String!): BatchPayload!
    }
`

module.exports = typeDefs
