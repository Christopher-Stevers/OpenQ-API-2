const Query = {
	user: async (parent, args, { prisma }) => {
		const value = prisma.user.findUnique({
			where: { address: args.address },
		});
		return value;
	},
	usersConnection: async (parent, args, { prisma }) => {
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
	}
};

module.exports = Query;