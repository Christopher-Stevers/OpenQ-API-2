const Query = {
	organization: async (_, args, { prisma }) => prisma.organization.findUnique({
		where: { id: args.organizationId },
	}),
	organizations: async (_, args) => {
		return args;
	}

};

module.exports = Query;