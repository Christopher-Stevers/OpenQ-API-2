const Mutation = {
	updatePrices: async (parent, args, { req, prisma }) => prisma.prices.updateMany(
		{
			data: {
				timestamp: Date.now(),
				priceObj: args.priceObj
			}
		}
	),
	createPrices: async (parent, args, { req, prisma }) => prisma.prices.create(
		{
			data: {
				timestamp: Date.now(),
				priceObj: args.priceObj
			}
		}
	)
};

module.exports = Mutation;
