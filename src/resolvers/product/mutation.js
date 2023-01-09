
const { AuthenticationError } = require('apollo-server');

const Mutation = {
	createProduct: async (parent, args, { req, prisma }) => {
		if (req.headers.authorization !== process.env.OPENQ_API_SECRET) {
			throw new AuthenticationError();
		}

		return prisma.product.create({
			data: {
				name: args.name
			},
		});
	},
	updateProduct: async (parent, args, { req, prisma }) => {
		if (req.headers.authorization !== process.env.OPENQ_API_SECRET) {
			throw new AuthenticationError();
		}
		return prisma.product.update({
			where: { id: args.id },
			data: {
				name: args.name
			}
		});
	},
	deleteProduct: async (parent, args, { req, prisma }) => {
		if (req.headers.authorization !== process.env.OPENQ_API_SECRET) {
			throw new AuthenticationError();
		}

		return prisma.product.delete({
			where: { name: args.name }
		});
	}
};

module.exports = Mutation;