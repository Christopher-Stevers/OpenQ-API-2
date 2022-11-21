const calculateTvl = require('../../utils/calculateTvl');
const calculateTvc = require('../../utils/calculateTvc');
const { AuthenticationError } = require('apollo-server');
const { verifySignature } = require('../../utils/auth/verifySignature');

const Mutation = {
	createBounty: async (parent, args, { req, prisma }) => {
		if (req.headers.authorization !== process.env.OPENQ_API_SECRET) {
			throw new AuthenticationError();
		}

		return prisma.bounty.create({
			data: {
				type: args.type,
				category: args.category || null,
				blacklisted: false,
				address: String(args.address),
				tvl: 0,
				tvc: -0,
				bountyId: args.bountyId,
				repository: {
					connectOrCreate: {
						where: {
							id: args.repositoryId
						},
						create: {
							id: args.repositoryId,
							organizationId: args.organizationId
						}
					},
				},
				organization: {
					connectOrCreate: {
						where: {
							id: args.organizationId
						},
						create: {
							id: args.organizationId
						}
					},
				}
			},
			include: { repository: true }
		});
	},
	updateBounty: async (parent, args, { req, prisma }) => {
		if (req.headers.authorization !== process.env.OPENQ_API_SECRET) {
			throw new AuthenticationError();
		}

		return prisma.bounty.upsert({
			where: { address: args.address },
			update: {
				category: args.category || null,
				...args.tvl && { tvl: args.tvl },
				...args.tvc && { tvc: args.tvc },
				type: args.type,
				...args.organizationId && {
					organization: {
						connectOrCreate: {
							where: {
								id: args.organizationId
							},
							create: {
								id: args.organizationId,
								blacklisted: false
							}
						},
					}
				},
				...args.repositoryId && {
					organization: {
						connectOrCreate: {
							where: {
								id: args.repositoryId
							},
							create: {
								id: args.repositoryId
							}
						},
					}
				}
			},
			create: {
				type: args.type,
				category: args.category || null,
				blacklisted: false,
				address: String(args.address),
				tvl: args.tvl || 0,
				tvc: args.tvc || 0,
				bountyId: args.bountyId,
				...args.organizationId && {
					organization: {
						connectOrCreate: {
							where: {
								id: args.organizationId
							},
							create: {
								id: args.organizationId,
								blacklisted: false
							},
						},
					},
				},
				...args.repositoryId && {
					repository: {
						connectOrCreate: {
							where: {
								id: args.repositoryId
							},
							create: {
								id: args.repositoryId
							},
						},
					},
				}
			},
		});
	},
	blackList: async (parent, args, { req, prisma }) => {
		if (req.headers.authorization !== process.env.BANHAMMER) {
			throw new AuthenticationError();
		}
		return prisma.bounty.update(
			{
				where: { bountyId: args.bountyId },
				data: { blacklisted: args.blackList }
			}
		);
	},
	addToTvl: async (parent, args, { req, prisma }) => {
		if (req.headers.authorization !== process.env.OPENQ_API_SECRET) {
			throw new AuthenticationError();
		}
		const { tokenBalance, address, add } = args;
		const bounty = await prisma.bounty.findUnique({
			where: { address },
		});
		const currentTvl = bounty?.tvl || 0;
		const tvl = await calculateTvl(tokenBalance, currentTvl, add);
		return prisma.bounty.update({
			where: { address },
			data: {
				tvl
			},
		});
	},
	addToTvc: async (parent, args, { req, prisma }) => {
		if (req.headers.authorization !== process.env.OPENQ_API_SECRET) {
			throw new AuthenticationError();
		}
		const { tokenAddress, volume, address, add } = args;
		const tvc = await calculateTvc(tokenAddress, volume, add);
		return prisma.bounty.update({
			where: { address },
			data: {
				tvc: {
					increment: tvc
				}
			},
		});
	},
	watchBounty: async (parent, args, { req, prisma }) => {
		if (!verifySignature(req, args.userAddress)) {
			throw new AuthenticationError();
		}
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
		if (!verifySignature(req, args.userAddress)) {
			throw new AuthenticationError();
		}
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
};

module.exports = Mutation;