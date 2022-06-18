const Bounty = {
	watchingUsers: async (parent, args, { req, prisma }) => {
		const cursor = args.after ? { address: args.after } : undefined;
		const users = await prisma.user.findMany({
			skip: args.after ? 1 : 0,
			cursor,
			take: args.limit,
			...(args.orderBy && args.sortOrder) && {
				orderBy: [
					{ [args.orderBy]: args.sortOrder },
					{ [args.orderBy && 'address']: args.orderBy && 'asc' },
				],
			},
			include: { watchedBounties: true },
			where: { address: { in: parent.watchingUserIds } },
		});
		const newCursor =
			users.length > 0 ? users[users.length - 1].address : null;
		return {
			users,
			cursor: newCursor,
		};
	},
};

module.exports = Bounty;