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

        watchBounty: async (parent, args) => {
            const bounty = await prisma.bounty.findUnique({
                where: { contractId: args.contractId },
            })
            const user = await prisma.user.upsert({
                where: { userAddress: args.userAddress },
                create: {
                    userAddress: args.userAddress,
                    watchedBountyIds: [bounty.id],
                },
                update: {
                    watchedBountyIds: {
                        push: bounty.id,
                    },
                },
            })
            return prisma.bounty.update({
                where: { contractId: args.contractId },
                data: {
                    watchingUserIds: {
                        push: user.id,
                    },
                },
            })
        },
        unWatchBounty: async (parent, args) => {
            const bounty = await prisma.bounty.findUnique({
                where: { contractId: args.contractId },
            })
            const user = await prisma.user.findUnique({
                where: { userAddress: args.userAddress },
            })
            const newBounties = user.watchedBountyIds.filter(
                (bountyId) => bountyId !== bounty.id
            )

            const newUsers = bounty.watchingUserIds.filter(
                (userId) => userId !== user.id
            )
            prisma.bounty.update({
                where: { contractId: args.contractId },
                data: {
                    watchingUserIds: {
                        set: newUsers,
                    },
                },
            })
            return prisma.user.update({
                where: { userAddress: args.userAddress },
                data: {
                    watchedBounties: {
                        set: newBounties,
                    },
                },
            })
        },
    },
}
module.exports = resolvers
