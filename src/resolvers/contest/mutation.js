const { AuthenticationError } = require('apollo-server');

const Mutation = {
	createContest: async (parent, args, { req, prisma }) => {
		if (req.headers.authorization !== process.env.OPENQ_API_SECRET) {
			throw new AuthenticationError();
		}

		return prisma.contest.create({
			data: {
				id: args.repositoryId,
				update: {
					bountyIds: {
						push: args.bountyId,
					},
				},
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
				}
			},
		});
	},
};

module.exports = Mutation;