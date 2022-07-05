const Query = {
	pr: async (_, args, { prisma }) => {
		return prisma.pr.findUnique({
			where: { prId: args.prId },
		});
	},

};

module.exports = Query;