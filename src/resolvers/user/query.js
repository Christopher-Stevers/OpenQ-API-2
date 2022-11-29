const Query = {
	user: async (parent, args, { prisma }) => {
		if (!(args.id || args.email || args.github)) {
			throw new Error('Must provide id, email, address, or github');
		}

		const value = await prisma.user.findUnique({
			where: { ...args },
			include: { starredOrganizations: true }
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