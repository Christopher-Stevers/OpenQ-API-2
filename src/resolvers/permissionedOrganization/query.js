const Query = {
	permissionedOrganization: async (_, args, { prisma }) =>{ 
		return prisma.permissionedOrganization.findUnique({
			where: { id: args.id }},
		);
	},

	permissionedOrganizations: async (_, args) => {
		return args;
	}

};

module.exports = Query;