const generateFilter = (organizationId, repositoryId, addresses, types, category) => {
	const inAddresses = addresses ? { address: { in: addresses } } : {};
	const inTypes = types ? { type: { in: types } } : {};
	const repoId = repositoryId ? { repositoryId } : {};
	const orgId = organizationId ? { organizationId } : {};
	const categoryUnwrapped = category ? { category } : {};
	return { ...repoId, ...orgId, ...categoryUnwrapped, ...inAddresses, ...inTypes };
};

const Bounties = {
	bountyConnection: async (parent, args, { prisma }) => {
		const { organizationId, addresses, types, category, repositoryId } = parent;
		const filters = generateFilter(organizationId, repositoryId, addresses, types, category);

		const cursor = parent.after ? { address: parent.after } : undefined;

		const nodes = await prisma.bounty.findMany({
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
			include: { organization: true, request: true },

		});
		return {
			nodes,
			cursor: nodes[nodes.length - 1]?.address,
		};
	},


	nodes: async (parent, args, { prisma }) => {
		const { organizationId, addresses, types, category, repositoryId } = parent;
		const filters = generateFilter(organizationId, repositoryId, addresses, types, category);

		const bounties = await prisma.bounty.findMany({
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
			include: { organization: true, request: true },

		});
		return bounties;
	}
};

module.exports = Bounties;