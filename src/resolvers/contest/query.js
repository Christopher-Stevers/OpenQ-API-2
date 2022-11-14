const Query = {
	contest: async (_, args, { prisma }) =>
		prisma.bounty.findUnique({
			where: { id: args.repositoryId },
		}),
	contests: async (parent, args) => {
		return args;
	}
};

module.exports = Query;