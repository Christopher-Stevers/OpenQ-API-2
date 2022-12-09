
const checkRepositoryAdmin = require('../utils/checkRepositoryAdmin');
const { AuthenticationError } = require('apollo-server');

const Mutation = {

	addContributor: async (parent, args, { req, prisma, githubClient }) => {
		const { error, errorMessage, viewerCanAdminister } = await checkRepositoryAdmin(req, args, githubClient);

		if (error) {
			throw new AuthenticationError(errorMessage);
		}

		if (!viewerCanAdminister) {
			throw new AuthenticationError(`User is not authorized to administer repository with id ${args.repositoryId}`);
		}

		const { prId, userId } = args;
		await prisma.contributor.upsert({

			where: { userId },
			create: {
				userId, prIds: { set: [prId] }
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

	upsertPr: async (parent, args, { req, prisma, githubClient }) => {
		const { error, errorMessage, viewerCanAdminister } = await checkRepositoryAdmin(req, args, githubClient);

		if (error) {
			throw new AuthenticationError(errorMessage);
		}

		if (!viewerCanAdminister) {
			throw new AuthenticationError(`User is not authorized to administer repository with id ${args.repositoryId}`);
		}

		const { prId, ...remainingArgs } = args;

		return prisma.pr.upsert({
			where: { prId },
			create: {
				prId,
				...remainingArgs
			},
			update: {
				...remainingArgs
			},
		});
	},

	removeContributor: async (parent, args, { req, prisma, githubClient }) => {
		const { error, errorMessage, viewerCanAdminister } = await checkRepositoryAdmin(req, args, githubClient);

		if (error) {
			throw new AuthenticationError(errorMessage);
		}

		if (!viewerCanAdminister) {
			throw new AuthenticationError(`User is not authorized to administer repository with id ${args.repositoryId}`);
		}
		const { prId, userId } = args;
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