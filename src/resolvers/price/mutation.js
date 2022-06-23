const Mutation = {
	updatePrices: async (parent, args, { req, prisma }) => prisma.prices.upsert(
		{
			data: {
				timestamp: Date.now(),
				priceObj: args.priceObj
			}
		}
	)
};

module.exports = Mutation;
