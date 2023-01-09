const Query = {
	proAccount: async (_, args, { prisma }) =>{ 
		return prisma.proAccount.findUnique({
			where: { id: args.id }},
		);
	},

	proAccounts: async (_, args) => {
		return args;
	}

};

module.exports = Query;