const Query = {
	bounty: async (_, args, { req, prisma }) =>
		prisma.bounty.findUnique({
			where: { address: args.address },
		}),
};

module.exports = Query;