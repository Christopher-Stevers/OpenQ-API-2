const Query = {
	organization: async (_, args, { prisma }) => prisma.organization.findUnique({
		where: { id: args.organizationId },
		include: {starringUsers: true}
	}),
	organizations: async (_, args, { prisma }) =>
		prisma.organization.findMany({
			where: {
				id: { in: args.organizationIds },
			}
		})

};

module.exports = Query;