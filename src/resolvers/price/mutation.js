const { AuthenticationError } = require('apollo-server');

const Mutation = {
	updatePrices: async (parent, args, { req, prisma }) => {
		if (req.headers.authorization !== process.env.OPENQ_API_SECRET) {
			throw new AuthenticationError();
		}
		return prisma.prices.upsert({
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
		});
	}
};

module.exports = Mutation;
