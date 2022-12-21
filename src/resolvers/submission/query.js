const Query = {
	submission: async (_, args, { prisma }) => {
		return prisma.submission.findUnique({
			where: { id: args.id },
		});
	},
	submissions: async (_, args, { prisma }) => {
		return prisma.submission.findMany({
			where: {
				...args.ids? {id: { in: args.ids }}:{},
			}
		});
	}

};

module.exports = Query;