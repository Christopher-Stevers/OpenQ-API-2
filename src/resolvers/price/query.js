const Query = {
	prices: async (parents, args, { req, prisma }) => prisma.prices.findMany({ take: 1, orderBy: { timestamp: 'desc' } })
};

module.exports = Query;