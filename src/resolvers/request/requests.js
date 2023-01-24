const generateFilter = (ids) => {
	const requestId = ids ? { id: {in: ids} } : {};
	return { ...requestId };
};

const Requests = {
	requestConnection: async (parent, args, { prisma }) => {

		const cursor = parent.after ? { address: parent.after } : undefined;
		const filters = generateFilter(parent.ids);
		const nodes = await prisma.request.findMany({
			skip: (!parent.after) ? 0 : 1,
			cursor,
			where: filters,
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

		});
		return {
			nodes,
			cursor: nodes[nodes.length - 1]?.address,
		};
	},


	nodes: async (parent, args, { prisma }) => {

		const filters = generateFilter(parent.ids);
		const requests = await prisma.request.findMany({
			where: filters,
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

		});
		return requests;
	}
};

module.exports = Requests;