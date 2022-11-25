const Query = {
	bounty: async (_, args, { prisma }) =>
		prisma.bounty.findUnique({
			where: { address: args.address },
			include: { repository: true, organization: true },
		}),
	bounties: async (parent, args) => {
		return args;
	}
};

module.exports = Query;