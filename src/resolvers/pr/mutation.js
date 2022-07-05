
const Mutation = {
	createPr: async (parent, args, { prisma }) => {
		const { thumbnail, bountyAddress, prId } = args;
		return prisma.pr.create({
			data: {
				prId,
				thumbnail,
				bountyAddress,

			},
		});
	},
	updatePr: async (parent, args, { prisma }) => {
		const { prId, contributorIds } = args;
		console.log(args);
		return prisma.pr.update({
			where: { prId },
			data: {
				contributorIds
			},
		});
	},

	addContributor: async (parent, args, { prisma }) => {
		const { prId, userId, address } = args;
		await prisma.contributor.upsert({

			where: { userId },
			update: {
				prIds: { push: prId }
			},
			create: {
				userId, address, prIds: { set: [prId] }
			}

		});

		return prisma.pr.update({
			where: { prId },
			data: {
				contributorIds: { push: userId }
			},
		});
	},

	removeContributor: async (parent, args, { prisma }) => {
		const { prId, userId, address } = args;


		const contributor = await prisma.contributor.findUnique({
			where: { userId },
		});
		const pr = await prisma.pr.findUnique({
			where: { prId },
		});
		await prisma.contributor.upsert({

			where: { userId },
			update: {
				prIds: { push: prId }
			},
			create: {
				userId, address, prIds: { set: [prId] }
			}

		});
		const newContributorIds = pr.contributorIds.filter(id => id !== userId);
		const newPrIds = contributor.prIds.filter(id => id !== prId);
		console.log(newPrIds);
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