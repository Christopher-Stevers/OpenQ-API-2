const Mutation = {
	createBounty: (parent, args, { req, prisma }) =>
		prisma.bounty.create({
			data: {
				tvl: 0,
				address: String(args.address),
				organizationId: args.organizationId,
				bountyId: args.bountyId
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
	unWatchBounty: async (parent, args, { _, prisma }) => {
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
	}
};

module.exports = Mutation;