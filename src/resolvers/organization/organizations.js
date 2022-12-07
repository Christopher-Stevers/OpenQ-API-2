const generateFilter = (organizationIds) => {

	const inOrganizationIds = organizationIds ? { id: { in: organizationIds }, } : {};
	return { ...inOrganizationIds };
};

const Organizations = {
	organizationConnection: async (parent, args, { prisma }) => {
		const { organizationIds } = parent;
		const filter = generateFilter(organizationIds);

		const cursor = parent.after ? { address: parent.after } : undefined;
		const nodes = await prisma.organization.findMany({
			skip: (!parent.after) ? 0 : 1,
			where: { ...filter },
			cursor,
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
		const { organizationIds } = parent;
		const filter = generateFilter(organizationIds);

		const organizations = await prisma.organization.findMany({
			skip: (!parent.after) ? 0 : 1,
			where: { ...filter },
			take: parent.limit,

		});
		return organizations;
	}
};
module.exports = Organizations;