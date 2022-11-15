const Query = {
	repository: async (_, args, { prisma }) =>
		prisma.bounty.findUnique({
			where: { id: args.repositoryId },
		}),
	repositories: async (parent, args) => {
		return args;
	}
};

module.exports = Query;