const Query = {
	bounty: async (_, args, { prisma }) =>
		prisma.bounty.findUnique({
			where: { address: args.address },
		}),
	bounties: async (parent, args) => {
		return args;
	}
};

module.exports = Query;