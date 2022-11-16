const Query = {
	bounty: async (_, args, { prisma }) =>
		prisma.bounty.findUnique({
			where: { address: args.address },
			include: { repository: true },
		}),
	bounties: async (parent, args) => {
		return args;
	}
};

module.exports = Query;