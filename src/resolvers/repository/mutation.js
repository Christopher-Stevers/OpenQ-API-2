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
};

module.exports = Mutation;