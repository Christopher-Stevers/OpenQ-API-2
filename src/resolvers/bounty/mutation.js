const Mutation = {
	createBounty: (parent, args, { req, prisma }) =>
		prisma.bounty.create({
			data: {
				tvl: 0,
				address: String(args.address),
				organizationId: args.organizationId,
			},
		}),
	updateBounty: async (parent, args, { req, prisma }) =>
		prisma.bounty.upsert({
			where: { address: args.address },
			update: { tvl: args.tvl, ...(args.organizationId) && { organizationId: args.organizationId } },
			create: {
				address: String(args.address),
				tvl: args.tvl,
				organizationId: args.organizationId,
			},
		}),
	watchBounty: async (parent, args, { req, prisma }) => {
		const bounty = await prisma.bounty.findUnique({
			where: { address: args.contractAddress },
		});
		const user = await prisma.user.upsert({
			where: { address: args.userAddress },
			update: {
				watchedBountyIds: {
					push: bounty.address,
				},
			},
			create: {
				address: args.userAddress,
				watchedBountyIds: [bounty.address],
			},
		});
		return prisma.bounty.update({
			where: { address: args.contractAddress },
			data: {
				watchingUserIds: {
					push: user.address,
				},
			},
		});
	},
	unWatchBounty: async (parent, args, { req, prisma }) => {
		const bounty = await prisma.bounty.findUnique({
			where: { address: args.contractAddress },
		});
		const user = await prisma.user.findUnique({
			where: { address: args.userAddress },
		});
		const newBounties = user.watchedBountyIds.filter(
			(bountyId) => bountyId !== bounty.address
		);
		const newUsers = bounty.watchingUserIds.filter(
			(userId) => userId !== user.address
		);
		await prisma.bounty.update({
			where: { address: args.contractAddress },
			data: {
				watchingUserIds: { set: newUsers },
			},
		});
		return prisma.user.update({
			where: { address: args.userAddress },
			data: {
				watchedBountyIds: { set: newBounties },
			},
		});
	},
	Bounty: {
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
	}
};

module.exports = Mutation;