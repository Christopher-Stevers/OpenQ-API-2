const Query = {
	prices: async (parents, args, { req, prisma }) => prisma.prices.findUnique({ where: { pricesId: 'pricesId' } })
};

module.exports = Query;