

const ProAccounts = {
	proAccountConnection: async (parent, args, { prisma }) => {

		const filter = parent.ids ? { id: { in: parent.ids }, } : {};
		const cursor = parent.after ? { address: parent.after } : undefined;
		const nodes = await prisma.proAccount.findMany({
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

		});
		return {
			nodes,
			cursor: nodes[nodes.length - 1]?.address,
		};
	},


	nodes: async (parent, args, { prisma }) => {
		const filter = parent.ids ? { id: { in: parent.ids }, } : {};

		const proAccounts = await prisma.proAccount.findMany({
			skip: (!parent.after) ? 0 : 1,
			take: parent.limit,
			where: { ...filter },

		});
		return proAccounts;
	}
};
module.exports = ProAccounts;