const Query = {
	product: async (_, args, { prisma }) =>
		prisma.product.findUnique({
			where: { id: args.id },
		}),
	products: async (parent, args) => {
		return args;
	}
};

module.exports = Query;