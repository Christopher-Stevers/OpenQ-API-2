const generateFilter = (
	organizationId,
	repositoryId,
	addresses,
	types,
	category,
	creatingUserId
) => {
	const inAddresses = addresses ? { address: { in: addresses } } : {};
	const inTypes = types ? { type: { in: types } } : {};
	const repoId = repositoryId ? { repositoryId } : {};
	const orgId = organizationId ? { organizationId } : {};
	const categoryUnwrapped = category ? { category } : {};
	const creatingUser = creatingUserId ? { creatingUserId } : {};
	return {
		...repoId,
		...orgId,
		...categoryUnwrapped,
		...inAddresses,
		...inTypes,
		...creatingUser,
	};
};

const Bounties = {
	bountyConnection: async (parent, args, { prisma }) => {
		const {
			organizationId,
			addresses,
			types,
			category,
			repositoryId,
			creatingUserId,
		} = parent;
		const filters = generateFilter(
			organizationId,
			repositoryId,
			addresses,
			types,
			category,
			creatingUserId
		);

		const cursor = parent.after ? { address: parent.after } : undefined;

		const nodes = await prisma.bounty.findMany({
			skip: !parent.after ? 0 : 1,
			cursor,
			where: filters,
			take: parent.limit,
			...(parent.orderBy
				? {
					orderBy: [
						{ [parent.orderBy]: parent.sortOrder },
						{
							[parent.orderBy || 'address']:
									parent.orderBy && parent.sortOrder,
						},
					],
				  }
				: {
					orderBy: {
						createdAt: parent.sortOrder || 'desc',
					},
				  }),
			include: { organization: true, requests: true },
		});
		return {
			nodes,
			cursor: nodes[nodes.length - 1]?.address,
		};
	},

	nodes: async (parent, args, { prisma }) => {
		console.log(parent, args);
		const {
			organizationId,
			addresses,
			types,
			category,
			repositoryId,
			creatingUserId,
		} = parent;
		const filters = generateFilter(
			organizationId,
			repositoryId,
			addresses,
			types,
			category,
			creatingUserId
		);
		console.log(filters);

		const bounties = await prisma.bounty.findMany({
			where: filters,
			take: parent.limit,
			...(parent.orderBy
				? {
					orderBy: [
						{ [parent.orderBy]: parent.sortOrder },
						{
							[parent.orderBy || 'address']:
									parent.orderBy && parent.sortOrder,
						},
					],
				  }
				: {
					orderBy: {
						createdAt: parent.sortOrder || 'desc',
					},
				  }),
			include: { organization: true, requests: true },
		});
		console.log(bounties);
		return bounties;
	},
};

module.exports = Bounties;
