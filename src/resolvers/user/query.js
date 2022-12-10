const Query = {
	user: async (parent, args, { prisma }) => {
		if (!(args.id || args.email || args.github)) {
			throw new Error('Must provide id, email, address, or github');
		}

		const value = await prisma.user.findUnique({
			where: { ...args },
			include: { starredOrganizations: true }
		});
		
		return value;
	},

	users: async (parent, args) => {
		return args;
	}
};

module.exports = Query;