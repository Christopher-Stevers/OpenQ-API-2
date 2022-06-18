const Query = {
	bounty: async (_, args, { req, prisma }) =>
		prisma.bounty.findUnique({
			where: { address: args.address },
		}),

	bountiesConnection: async (parent, args, { req, prisma }) => {
		console.log(args);
		const cursor = args.after ? { address: args.after } : undefined;
		const bounties = await prisma.bounty.findMany({
			skip: args.after ? 1 : 0,
			cursor,
			where: { organizationId: args.organizationId },
			take: args.limit,
			orderBy: [
				{ [args.orderBy]: args.sortOrder },
				{ [args.orderBy && 'address']: args.orderBy && 'asc' },
			],
			include: { watchingUsers: true },
		});
		return {
			bounties,
			cursor: bounties[bounties.length - 1].address,
		};
	},

};

module.exports = Query;