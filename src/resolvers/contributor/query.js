const Query = {

	contributor: async (_, args, { prisma }) => {

		return await prisma.contributor.findUnique({
			where: { userId: args.userId },
		});

	},
};
module.exports = Query;