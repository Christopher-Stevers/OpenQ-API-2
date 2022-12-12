const Query = {
	user: async (parent, args, { prisma }) => {
		console.log('theargs', args);
		if (!(args.id || args.email || args.github)) {
			throw new Error('Must provide id, email, address, or github');
		}

		let value;
		if (args.github) {
			value = await prisma.user.findUnique({
				where: { github: args.github  },
				include: { starredOrganizations: true }
			});
		} else if (args.email) {
			value = await prisma.user.findUnique({
				where: { email: args.email  },
				include: { starredOrganizations: true }
			});
		} else {
			value = await prisma.user.findUnique({
				where: { id: args.id  },
				include: { starredOrganizations: true }
			});
		}
		
		return value;
	},

	users: async (parent, args) => {
		return args;
	}
};

module.exports = Query;