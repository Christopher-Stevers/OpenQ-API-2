

const Users = {
	userConnection: async (parent, args, { prisma }) => {

		const cursor = parent.after ? { address: parent.after } : undefined;
		const filter = parent.userIds ? { id: { in: parent.userIds }, } : {};
		const nodes = await prisma.user.findMany({
			skip: (!parent.after) ? 0 : 1,
			cursor,
			where: { ...filter },
			take: parent.limit,
			...parent.orderBy && {
				orderBy: [
					{ [parent.orderBy]: parent.sortOrder },
					{ [parent.orderBy || 'address']: parent.orderBy && parent.sortOrder },
				],
			}
			,
			include: { watchedBounties: true },

		});
		return {
			nodes,
			cursor: nodes[nodes.length - 1]?.address,
		};
	},


	nodes: async (parent, args, { prisma }) => {
		const filter = parent.userIds ? { id: { in: parent.userIds }, } : {};

		const users = await prisma.user.findMany({
			skip: (!parent.after) ? 0 : 1,
			where: { ...filter },
			take: parent.limit,
			include: { watchedBounties: true },

		});
		return users;
	}
};
module.exports = Users;