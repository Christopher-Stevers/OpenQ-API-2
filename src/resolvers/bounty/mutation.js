const { AuthenticationError } = require('apollo-server');
const checkUserAuth = require('../utils/checkUserAuth');

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
							id: args.repositoryId,
						},
						create: {
							id: args.repositoryId,
							organizationId: args.organizationId,
						},
					},
				},
				organization: {
					connectOrCreate: {
						where: {
							id: args.organizationId,
						},
						create: {
							id: args.organizationId,
						},
					},
				},
				creatingUser: {
					connectOrCreate: {
						where: {
							id: args.creatingUserId,
						},
						create: {
							id: args.creatingUserId,
						},
					},
				},
			},
			include: { repository: true, organization: true },
		});
	},
	updateBounty: async (parent, args, { req, prisma }) => {
		console.log(args);
		if (req.headers.authorization !== process.env.OPENQ_API_SECRET) {
			throw new AuthenticationError();
		}
		const date = new Date(parseInt(args.createdAt) * 1000);
		const ISOstring = date.toISOString();

		return prisma.bounty.upsert({
			where: { address: args.address },
			update: {
				createdAt: ISOstring,
				category: args.category || null,
				...(args.tvl && { tvl: args.tvl }),
				...(args.tvc && { tvc: args.tvc }),
				...(args.creatingUserId && {
					creatingUser: {
						connectOrCreate: {
							where: {
								id: args.creatingUserId,
							},
							create: {
								id: args.creatingUserId,
							},
						},
					},
				}),
				type: args.type,
				...(args.organizationId && {
					organization: {
						connectOrCreate: {
							where: {
								id: args.organizationId,
							},
							create: {
								id: args.organizationId,
								blacklisted: false,
							},
						},
					},
				}),
				...(args.creatingUserId && {
					organization: {
						connectOrCreate: {
							where: {
								id: args.creatingUserId,
							},
							create: {
								id: args.creatingUserId,
							},
						},
					},
				}),
				...(args.repositoryId && {
					repository: {
						connectOrCreate: {
							where: {
								id: args.repositoryId,
							},
							create: {
								id: args.repositoryId,
								organization: {
									connectOrCreate: {
										where: {
											id: args.organizationId,
										},
										create: {
											id: args.organizationId,
										},
									},
								},
							},
						},
					},
				}),
			},
			create: {
				type: args.type,
				category: args.category || null,
				blacklisted: false,
				address: String(args.address),
				tvl: args.tvl || 0,
				tvc: args.tvc || 0,
				bountyId: args.bountyId,
				...(args.creatingUserId && {
					creatingUser: {
						connectOrCreate: {
							where: {
								id: args.creatingUserId,
							},
							create: {
								id: args.creatingUserId,
							},
						},
					},
				}),
				...(args.organizationId && {
					organization: {
						connectOrCreate: {
							where: {
								id: args.organizationId,
							},
							create: {
								id: args.organizationId,
								blacklisted: false,
							},
						},
					},
				}),
				...(args.repositoryId && {
					repository: {
						connectOrCreate: {
							where: {
								id: args.repositoryId,
							},
							create: {
								id: args.repositoryId,
								organization: {
									connectOrCreate: {
										where: {
											id: args.organizationId,
										},
										create: {
											id: args.organizationId,
										},
									},
								},
							},
						},
					},
				}),
			},
		});
	},
	blacklist: async (parent, args, { req, prisma }) => {
		if (req.headers.authorization !== process.env.BANHAMMER) {
			throw new AuthenticationError();
		}
		return prisma.bounty.update({
			where: { bountyId: args.bountyId },
			data: { blacklisted: args.blacklist },
		});
	},
	updateBountyValuation: async (parent, args, { req, prisma }) => {
		if (req.headers.authorization !== process.env.OPENQ_API_SECRET) {
			throw new AuthenticationError();
		}
		const { tvl = 0, tvc = 0, address } = args;

		return prisma.bounty.update({
			where: { address },
			data: {
				tvl: {
					increment: tvl,
				},
				tvc: {
					increment: tvc,
				},
			},
		});
	},
	watchBounty: async (
		parent,
		args,
		{ req, prisma, githubClient, emailClient }
	) => {
		const { error, errorMessage, id } = await checkUserAuth(
			prisma,
			req,
			args,
			emailClient,
			githubClient
		);

		if (error) {
			throw new AuthenticationError(errorMessage);
		}

		const bounty = await prisma.bounty.findUnique({
			where: { address: args.contractAddress },
		});

		const user = await prisma.user.update({
			where: { id },
			data: {
				watchedBountyIds: {
					push: bounty.address,
				},
			},
		});

		return prisma.bounty.update({
			where: { address: bounty.address },
			data: {
				watchingUserIds: {
					push: user.id,
				},
			},
		});
	},
	unwatchBounty: async (
		parent,
		args,
		{ req, prisma, emailClient, githubClient }
	) => {
		const { error, errorMessage, id } = await checkUserAuth(
			prisma,
			req,
			args,
			emailClient,
			githubClient
		);

		if (error) {
			throw new AuthenticationError(errorMessage);
		}

		const bounty = await prisma.bounty.findUnique({
			where: { address: args.contractAddress },
		});

		const user = await prisma.user.findUnique({
			where: { id },
		});

		const newBounties = user.watchedBountyIds.filter(
			(bountyId) => bountyId !== bounty.address
		);

		const newUsers = bounty.watchingUserIds.filter(
			(userId) => userId !== user.id
		);

		await prisma.user.update({
			where: { id },
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
	},
};

module.exports = Mutation;
