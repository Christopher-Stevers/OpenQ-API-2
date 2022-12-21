const { AuthenticationError } = require('apollo-server');
const checkRepositoryAdmin = require('../utils/checkRepositoryAdmin');
const Mutation = {
	createRepository: async (parent, args, { req, prisma }) => {
		if (req.headers.authorization !== process.env.OPENQ_API_SECRET) {
			throw new AuthenticationError();
		}

		return prisma.repository.create({
			data: {
				id: args.repositoryId,
				organization: {
					connectOrCreate: {
						where: {
							id: args.organizationId
						},
						create: {
							id: args.organizationId
						},
					},
				}
			},
		});
	},
	addUserToRepository: async (parent, args, { req, prisma }) => {
		if (req.headers.authorization !== process.env.OPENQ_API_SECRET) {
			throw new AuthenticationError();
		}

		return prisma.repository.update({
			where: { id: args.repositoryId },
			data: {
				participants: {
					connect: {
						id: args.userId
					}
				}
			},
		});
	},
	setIsContest: async (parent, args, { req, prisma, githubClient }) => {
		const { error, errorMessage, viewerCanAdminister } = await checkRepositoryAdmin(req, args, githubClient);

		if (error) {
			throw new AuthenticationError(errorMessage);
		}

		if (!viewerCanAdminister) {
			throw new AuthenticationError(`User is not authorized to administer repository with id ${args.repositoryId}`);
		}

		const startDate = new Date(args.startDate);
		const registrationDeadline = new Date(args.registrationDeadline);
		// upsert repository as contest
	 await prisma.repository.upsert({
			where: { id: args.repositoryId },
			update: { isContest: args.isContest, startDate, registrationDeadline },
			create: {
				id: args.repositoryId,
				isContest: args.isContest,
				organization: {
					connectOrCreate: {
						where: {
							id: args.organizationId
						},
						create: {
							id: args.organizationId
						},
					},

				}
			},
		});
		return prisma.repository.findUnique({
			where: { id: args.repositoryId },
		});
	},
	setHackathonBlacklist: async (parent, args, { req, prisma, githubClient }) => {
		const { error, errorMessage, viewerCanAdminister } = await checkRepositoryAdmin(req, args, githubClient);

		if (error) {
			throw new AuthenticationError(errorMessage);
		}

		if (!viewerCanAdminister) {
			throw new AuthenticationError(`User is not authorized to administer repository with id ${args.repositoryId}`);
		}

		return prisma.repository.update({
			where: { id: args.repositoryId },
			data: { hackathonBlacklisted: args.hackathonBlacklisted }
		});
	},
};

module.exports = Mutation;