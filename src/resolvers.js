const { prisma } = require('./db')

const resolvers = {
    Query: {
        bountiesConnection: async (parent, args) => {
            const cursor = args.after ? { id: args.after } : undefined
            const bounties = await prisma.bounty.findMany({
                cursor,
                take: args.limit,
                orderBy: { [args.orderBy]: args.sortOrder },
            })
            return {
                bounties,
                cursor: bounties[bounties.length - 1].id,
            }
        },
    },
    Mutation: {
        createBounty: (parent, args) =>
            prisma.bounty.create({
                data: {
                    tvl: Number(args.tvl),
                    bountyId: String(args.bountyId),
                },
            }),
        updateBounty: async (parent, args) =>
            prisma.bounty.updateMany({
                where: { bountyId: args.bountyId },
                data: { tvl: args.tvl },
            }),
    },
}
module.exports = resolvers
