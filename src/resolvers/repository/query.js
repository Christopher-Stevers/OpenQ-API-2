const Query = {
	repository: async (_, args, { prisma }) =>
		prisma.repository.findUnique({
			where: { id: args.id },
			include: { organization: true, participants: true, Bounties: true },
		}),
	repositories: async (parent, args) => {
		return args;
	}
};

module.exports = Query;