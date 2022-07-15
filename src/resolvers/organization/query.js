const Query = {
	organization: async (_, args, { prisma }) =>
		prisma.organization.findUnique({
			where: { id: args.organizationId },
		}),
};

module.exports = Query;