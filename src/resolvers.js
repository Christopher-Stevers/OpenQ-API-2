const { prisma } = require('./db');

const resolvers = {
	Query: {
		bountiesConnection: async (parent, args) => {
			const cursor = args.after ? { address: args.after } : undefined;
			const bounties = await prisma.bounty.findMany({
				skip: args.after ? 1 : 0,
				cursor,
				where: { organizationId: args.organizationId },
				take: args.limit,
				orderBy: [
					{ [args.orderBy]: args.sortOrder },
					{ [args.orderBy && 'address']: args.orderBy && 'asc' },
				],
				include: { watchingUsers: true },
			});
			return {
				bounties,
				cursor: bounties[bounties.length - 1].address,
			};
		},
		usersConnection: async (parent, args) => {
			const cursor = args.after ? { address: args.after } : undefined;
			const users = await prisma.user.findMany({
				skip: args.after ? 1 : 0,
				cursor,
				take: args.limit,
				orderBy: { [args.orderBy]: args.sortOrder },
			});

			return {
				users,
				cursor: users[users.length - 1].address,
			};
		},

		user: async (parent, args) =>
			prisma.user.findUnique({
				where: { address: args.address },
			}),
		bounty: async (parent, args) =>
			prisma.bounty.findUnique({
				where: { address: args.address },
			}),
	},
	User: {
		watchedBounties: async (parent, args) => {
			const cursor = args.after ? { address: args.after } : undefined;
			const bounties = await prisma.bounty.findMany({
				skip: args.after ? 1 : 0,
				cursor,
				take: args.limit,
				orderBy: [
					{ [args.orderBy]: args.sortOrder },
					{ [args.orderBy && 'address']: args.orderBy && 'asc' },
				],
				include: { watchingUsers: true },
				where: { address: { in: parent.watchedBountyIds } },
			});
			const newCursor =
				bounties.length > 0
					? bounties[bounties.length - 1].address
					: null;
			return {
				bounties,
				cursor: newCursor,
			};
		},
	},
	Bounty: {
		watchingUsers: async (parent, args) => {
			const cursor = args.after ? { address: args.after } : undefined;
			const users = await prisma.user.findMany({
				skip: args.after ? 1 : 0,
				cursor,
				take: args.limit,
				orderBy: [
					{ [args.orderBy]: args.sortOrder },
					{ [args.orderBy && 'address']: args.orderBy && 'asc' },
				],
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
	},

	Mutation: {
		createBounty: (parent, args) =>
			prisma.bounty.create({
				data: {
					tvl: 0,
					address: String(args.address),
					organizationId: args.organizationId,
				},
			}),
		updateBounty: async (parent, args) =>
			prisma.bounty.upsert({
				where: { address: args.address },
				update: { tvl: args.tvl, organizationId: args.organizationId },
				create: {
					address: String(args.address),
					tvl: args.tvl,
					organizationId: args.organizationId,
				},
			}),

		watchBounty: async (parent, args) => {
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
		unWatchBounty: async (parent, args) => {
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
	},
};
module.exports = resolvers;
