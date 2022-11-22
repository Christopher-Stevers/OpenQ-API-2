
const Bounties = {
	bountyConnection: async (parent, args, { prisma }) => {

		const cursor = parent.after ? { address: parent.after } : undefined;
		const organizationIdObj = parent.organizationId ? { organizationId: parent.organizationId } : {};
		const nodes = await prisma.bounty.findMany({
			skip: (!parent.after) ? 0 : 1,
			cursor,
			where: { ...organizationIdObj, type: { in: parent.types }, category: parent.category, address: { in: parent.addresses }, repositoryId: parent.repositoryId },
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
		const organizationIdObj = parent.organizationId ? { organizationId: parent.organizationId } : {};
		const bounties = await prisma.bounty.findMany({
			where: { ...organizationIdObj, type: { in: parent.types }, category: parent.category, address: { in: parent.addresses } },
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