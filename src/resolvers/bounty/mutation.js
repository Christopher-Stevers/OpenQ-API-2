const calculateTvl = require('../../utils/calculateTvl');
const { AuthenticationError } = require('apollo-server');
const ecdsaRecover = require('../../utils/ecdsaRecover');

const Mutation = {
	createBounty: async (parent, args, { req, prisma }) => {
		console.log(req.headers.authorization, process.env.OPENQ_API_SECRET);
		if (req.headers.authorization !== process.env.OPENQ_API_SECRET) {
			throw new AuthenticationError();
		}
		return prisma.bounty.create({
			data: {
				tvl: 0,
				address: String(args.address),
				organizationId: args.organizationId,
				bountyId: args.bountyId
			},
		});
	},
	updateBounty: async (parent, args, { req, prisma }) => {
		if (req.headers.authorization !== process.env.OPENQ_API_SECRET) {
			throw new AuthenticationError();
		}
		return prisma.bounty.upsert({
			where: { address: args.address },
			update: { tvl: args.tvl, ...(args.organizationId) && { organizationId: args.organizationId } },
			create: {
				address: String(args.address),
				tvl: args.tvl,
				organizationId: args.organizationId,
				bountyId: args.bountyId
			},
		});
	},
	addToTvl: async (parent, args, { req, prisma }) => {
		if (req.headers.authorization !== process.env.OPENQ_API_SECRET) {
			throw new AuthenticationError();
		}
		const { tokenBalance, address, add } = args;
		const bounty = await prisma.bounty.findUnique({
			where: { address },
		});
		const currentTvl = bounty.tvl;
		const tvl = await calculateTvl(tokenBalance, currentTvl, add);
		return prisma.bounty.update({
			where: { address },
			data: {
				tvl
			},
		});
	},
	watchBounty: async (parent, args, { req, prisma }) => {
		if (ecdsaRecover(args.signature) === args.userAddress) {

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
		}
		else {
			return prisma.bounty.findUnique({
				where: { address: args.contractAddress },
			});
		}
	},
	unWatchBounty: async (parent, args, { _, prisma }) => {

		if (ecdsaRecover(args.signature) === args.userAddress) {
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

			await prisma.user.update({
				where: { address: args.userAddress },
				data: {
					watchedBountyIds: { set: newBounties },
				},
			});
			return prisma.bounty.update({
				where: { address: args.contractAddress },
				data: {
					watchingUserIds: { set: newUsers },
				},
			});
		}

		else {
			return prisma.bounty.findUnique({
				where: { address: args.contractAddress },

			},
			);
		}
	}
};

module.exports = Mutation;