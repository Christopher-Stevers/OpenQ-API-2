
const Bounties = {
	bountyConnection: async (parent, args, { prisma }) => {
		const cursor = parent.after ? { address: parent.after } : undefined;
		const nodes = await prisma.bounty.findMany({
			skip: (!parent.after) ? 0 : 1,
			cursor,
			where: { organizationId: parent.organizationId, type: { in: parent.types }, category: parent.category, address: { in: parent.addresses } },
			take: parent.limit,
			...parent.orderBy ? {
				orderBy: [
					{ [parent.orderBy]: parent.sortOrder },
					{ [parent.orderBy || 'address']: parent.orderBy && parent.sortOrder },
				],
			} :
				{
					orderBy: {
						createdAt: parent.sortOrder || 'desc'
					}
				}
			,
			include: { organization: true },

		});
		return {
			nodes,
			cursor: nodes[nodes.length - 1]?.address,
		};
	},


	nodes: async (parent, args, { prisma }) => {
		const bounties = await prisma.bounty.findMany({
			where: { organizationId: parent.organizationId, type: { in: parent.types }, category: parent.category, address: { in: parent.addresses } },
			take: parent.limit,
			...parent.orderBy ? {
				orderBy: [
					{ [parent.orderBy]: parent.sortOrder },
					{ [parent.orderBy || 'address']: parent.orderBy && parent.sortOrder },
				],
			} :
				{
					orderBy: {
						createdAt: parent.sortOrder || 'desc'
					}
				}
			,
			include: { organization: true },

		});
		return bounties;
	}
};

module.exports = Bounties;