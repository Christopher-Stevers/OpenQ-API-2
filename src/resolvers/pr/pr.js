const PR = {

	contributors: async (_, args, { prisma }) => {

		return prisma.contributor.findMany({
		});

	},
};
module.exports = PR;