const Query = {
	bounty: async (_, args, { prisma }) =>
		prisma.bounty.findUnique({
			where: { address: args.address },
		}),
	bounties: async (_, args, { prisma }) =>
		prisma.bounty.findMany({
			where: { address: { in: args.addresses } },
		}),
	bountiesConnection: async (parent, args, { prisma }) => {
		const cursor = args.after ? { address: args.after } : undefined;
		const bounties = await prisma.bounty.findMany({
			skip: (args.orderBy === 'address' || !args.after) ? 0 : 1,
			cursor,
			where: { organizationId: args.organizationId },
			take: args.limit,
			orderBy: [
				{ [args.orderBy]: args.sortOrder },
				{ [args.orderBy && 'address']: args.orderBy && args.sortOrder },
			],
			include: { watchingUsers: true },
		});
		return {
			bounties,
			cursor: bounties[bounties.length - 1]?.address,
		};
	},
};

module.exports = Query;