
const validateOwnership = require('./validateOwnership');

const Mutation = {
	updatePr: async (parent, args, { req, prisma }) => {
		const cookie = req.headers.cookie;
		await validateOwnership(prId, cookie);
		const { prId, contributorIds } = args;
		return prisma.pr.update({
			where: { prId },
			data: {
				contributorIds
			},
		});
	},

	addContributor: async (parent, args, { req, prisma }) => {
		const { prId, userId, address } = args;
		const cookie = req.headers.cookie;
		await validateOwnership(prId, cookie);
		await prisma.contributor.upsert({

			where: { userId },
			create: {
				userId, address, prIds: { set: [prId] }
			},
			update: {
				prIds: { push: prId }
			}

		});

		return prisma.pr.upsert({
			where: { prId },
			create: {
				prId,
				contributorIds: { set: [userId] }

			},
			update: {
				contributorIds: { push: userId }
			},
		});
	},

	blackListPr: async (parent, args, { req, prisma }) => {
		const { prId, blacklisted } = args;
		const cookie = req.headers.cookie;
		await validateOwnership(prId, cookie);
		return prisma.pr.upsert({
			where: { prId },
			create: {
				prId,
				blacklisted
			},
			update: {
				blacklisted
			},
		});
	},

	removeContributor: async (parent, args, { req, prisma }) => {
		const { prId, userId } = args;
		const cookie = req.headers.cookie;
		await validateOwnership(prId, cookie);
		const contributor = await prisma.contributor.findUnique({
			where: { userId },
		});
		const pr = await prisma.pr.findUnique({
			where: { prId },
		});
		await prisma.contributor.update({
			where: { userId },
			data: {
				prIds: { push: prId }
			},
		});
		const newContributorIds = pr.contributorIds.filter(id => id !== userId);
		const newPrIds = contributor.prIds.filter(id => id !== prId);
		await prisma.contributor.update({
			where: { userId },
			data: {
				prIds: { set: newPrIds }
			}
		});
		return prisma.pr.update({
			where: { prId },
			data: {
				contributorIds: { set: newContributorIds }
			},
		});
	},
};

module.exports = Mutation;