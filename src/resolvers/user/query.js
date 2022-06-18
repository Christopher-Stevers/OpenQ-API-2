const Query = {
	user: async (parent, args, { req, prisma }) =>
		prisma.user.findUnique({
			where: { address: args.address },
		}),
	usersConnection: async (parent, args, { req, prisma }) => {
		const cursor = args.after ? { address: args.after } : undefined;
		const users = await prisma.user.findMany({
			skip: args.after ? 1 : 0,
			cursor,
			take: args.limit,
			orderBy: { [args.orderBy]: args.sortOrder },
		});

		return {
			users,
			cursor: users[users.length - 1].address,
		};
	},
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
			]
		});
		console.log(bounties);
		return {
			bounties,
			cursor: bounties[bounties.length - 1].address,
		};
	},
};

module.exports = Query;