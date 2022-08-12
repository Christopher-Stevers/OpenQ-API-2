
const { AuthenticationError } = require('apollo-server');
const { verifySignature } = require('../../utils/auth/verifySignature');

const Mutation = {
	updateUser: async (parent, args, { req, prisma }) => {
		if (!verifySignature(req, args.address)) {
			throw new AuthenticationError('please sign in with ethereum');
		}
		return prisma.user.upsert(
			{
				where: { address: args.address },
				create: {
					address: args.address,
					company: args.company,
					email: args.email,
					city: args.city,
					streetAddress: args.streetAddress,
					country: args.country,
					province: args.province

				},
				update: {
					company: args.company,
					email: args.email,
					city: args.city,
					streetAddress: args.streetAddress,
					country: args.country,
					province: args.province
				}
			}
		);
	},
};

module.exports = Mutation;