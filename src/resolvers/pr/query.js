const Query = {
	pr: async (_, args, { prisma }) => {
		return prisma.pr.findUnique({
			where: { prId: args.prId },
		});
	},
	prs: async (_, args, { prisma }) => {
		return prisma.pr.findMany({
			where: {
				prId: { in: args.prIds },
			}
		});
	}

};

module.exports = Query;