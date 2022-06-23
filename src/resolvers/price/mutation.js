const Mutation = {
	updatePrices: async (parent, args, { req, prisma }) => prisma.prices.upsert({
		where: {
			pricesId: args.pricesId,
		},
		update: {
			pricesId: args.pricesId,
			timestamp: Date.now(),
			priceObj: args.priceObj
		},
		create: {
			pricesId: args.pricesId,
			timestamp: Date.now(),
			priceObj: args.priceObj
		}
	})
};

module.exports = Mutation;
