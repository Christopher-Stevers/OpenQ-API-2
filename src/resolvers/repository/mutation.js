const { AuthenticationError } = require('apollo-server');

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
					connectOrCreate: {
						where: { address: args.userId },
						create: { address: args.userId }
					}
				}
			},
		});
	},

	setIsContest: async (parent, args, { prisma }) => {
		const startDate = new Date(args.startDate);
		const registrationDeadline = new Date(args.registrationDeadline);
		// upsert repository as contest
		return prisma.repository.upsert({
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
	}
};

module.exports = Mutation;