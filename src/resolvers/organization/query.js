const Query = {
	organization: async (_, args, { prisma }) =>
		prisma.organization.findUnique({
			where: { id: args.organizationId },
			include: { organizationBounties: true }
		}),

	organizations: async (_, args, { prisma }) => {
		return prisma.organization.findMany({
			where: {
				id: { in: args.organizationIds },
				...(args.types && {
					organizationBounties: {
						some: {
							type: { in: args.types }
						}
					}
				})
			},
		});
	},

};

module.exports = Query;