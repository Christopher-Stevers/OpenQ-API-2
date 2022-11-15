const Query = {
	repository: async (_, args, { prisma }) =>
		prisma.repository.findUnique({
			where: { id: args.repositoryId },
		}),
	repositories: async (parent, args) => {
		return args;
	}
};

module.exports = Query;