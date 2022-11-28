const Query = {
	user: async (parent, args, { prisma }) => {
		const value = await prisma.user.findUnique({
			where: { id: args.id },
			include: { starredOrganizations: true }
		});
		return value;
	},
	userByEmail: async (parent, args, { prisma }) => {
		const value = await prisma.user.findUnique({
			where: { email: args.email },
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