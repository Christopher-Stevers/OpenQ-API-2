

const Repositories = {
	repositoryConnection: async (parent, args, { prisma }) => {

		const cursor = parent.after ? { address: parent.after } : undefined;
		const organizationIdObj = parent.organizationId ? { organizationId: parent.organizationId } : {};
		const nodes = await prisma.repository.findMany({
			skip: (!parent.after) ? 0 : 1,
			cursor,
			where: { ...organizationIdObj, },
			take: parent.limit,
			...parent.orderBy && {
				orderBy: [
					{ [parent.orderBy]: parent.sortOrder },
					{ [parent.orderBy || 'address']: parent.orderBy && parent.sortOrder },
				],
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
		const repositories = await prisma.repository.findMany({
			skip: (!parent.after) ? 0 : 1,
			where: { ...organizationIdObj, },
			take: parent.limit,
			...parent.orderBy && {
				orderBy: [
					{ [parent.orderBy]: parent.sortOrder },
					{ [parent.orderBy || 'address']: parent.orderBy && parent.sortOrder },
				],
			}
			,
			include: { organization: true },

		});
		return repositories;
	}
};
module.exports = Repositories;