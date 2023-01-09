

const Products = {


	productConnection: async (parent, args, { prisma }) => {

		const cursor = parent.after ? { address: parent.after } : undefined;
		const filter = parent.productIds ? { id: { in: parent.productIds }, } : {};
		const nodes = await prisma.product.findMany({
			skip: (!parent.after) ? 0 : 1,
			cursor,
			where: { ...filter },
			take: parent.limit,
			...parent.orderBy && {
				orderBy: [
					{ [parent.orderBy]: parent.sortOrder },
					{ [parent.orderBy || 'address']: parent.orderBy && parent.sortOrder },
				],
			}

		});
		return {
			nodes,
			cursor: nodes[nodes.length - 1]?.address,
		};
	},


	nodes: async (parent, args, { prisma }) => {
		const filter = parent.productIds ? { id: { in: parent.productIds }, } : {};

		const products = await prisma.product.findMany({
			skip: (!parent.after) ? 0 : 1,
			where: { ...filter },
			take: parent.limit,

		});
		return products;
	}

};

module.exports = Products;