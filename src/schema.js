const { gql } = require('apollo-server')
const {prisma} = require('./db')
const typeDefs = gql`
  type Post {
    content: String
    id: ID!
    published: Boolean!
    title: String!
  }
  type Bounty {
	  tvl: Int!
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
    feed: [Post!]!
    post(id: String!): Post
	bountiesConnection(after: ID,  limit: Int!, orderBy: String, sortOrder: String): BountyConnection
  }
  type Mutation {
	createBounty(tvl: Int!, bountyId: String!): Bounty!
	updateBounty(tvl: Int!, bountyId: String!): BatchPayload
  }
`


  const resolvers = {
	Query: {
	  bountiesConnection: async(parent, args) => {
		   cursor = args.after? {id: args.after}: undefined
		const bounties = await prisma.bounty.findMany(
			{
			cursor,
			take: args.limit,
			orderBy: {[args.orderBy]: args.sortOrder}
		}
		);
		return {
			bounties,
			cursor: bounties[bounties.length - 1].id,
			

		}	
	  },

	},
	Mutation: {
		createBounty: (parent, args)=>{
			return prisma.bounty.create({
				data: {
					tvl: Number(args.tvl),
					bountyId: String(args.bountyId)
				}
			})
		},
		updateBounty: async(parent, args)=>{
			console.log(args);
				const bounties= await prisma.bounty.updateMany({
				where: {bountyId: "mine"},
				data: {tvl: args.tvl}
			})
			return bounties
			
			
		}
	  },

}


module.exports = {
  resolvers,
  typeDefs,
}