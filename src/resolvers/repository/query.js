const Query = {
	repository: async (_, args, { prisma }) =>
		prisma.repository.findUnique({
			where: { id: args.id },
			include: { organization: true, participants: true },
		}),
	repositories: async (_, args, { prisma }) => {
		return prisma.repository.findMany({
			include: { organization: true, participants: true },
		});
	},
};

module.exports = Query;