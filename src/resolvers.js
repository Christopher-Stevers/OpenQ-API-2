const { prisma } = require('./db')

const resolvers = {
    Query: {
        bountiesConnection: async (parent, args) => {
            const cursor = args.after ? { contractId: args.after } : undefined
            const bounties = await prisma.bounty.findMany({
                cursor,
                take: args.limit,
                orderBy: { [args.orderBy]: args.sortOrder },
            })
            return {
                bounties,
                cursor: bounties[bounties.length - 1].contractId,
            }
        },
    },
    Mutation: {
        createBounty: (parent, args) =>
            prisma.bounty.create({
                data: {
                    tvl: Number(args.tvl),
                    contractId: String(args.contractId),
                },
            }),
        updateBounty: async (parent, args) =>
            prisma.bounty.updateMany({
                where: { contractId: args.contractId },
                data: { tvl: args.tvl },
            }),
    },
}
module.exports = resolvers
