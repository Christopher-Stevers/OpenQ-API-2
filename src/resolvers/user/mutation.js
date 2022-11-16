
const { AuthenticationError } = require('apollo-server');
const { verifySignature } = require('../../utils/auth/verifySignature');

const Mutation = {
	updateUser: async (parent, args, { req, prisma }) => {
		if (!verifySignature(req, args.address)) {
			throw new AuthenticationError();
		}

		const mutableArgs = { ...args };
		delete mutableArgs.address;


		return prisma.user.upsert(
			{
				where: {
					address: args.address,
				},
				create: {
					watchedBountyIds: [],
					starredOrganizationIds: [],
					...args
				}
				,
				update: {
					...mutableArgs,
				}
			}
		);
	},
	updateUserSimple: async (parent, args, { prisma }) => {

		const mutableArgs = { ...args };
		delete mutableArgs.address;

		return prisma.user.upsert(
			{
				where: {
					address: args.address,
				},
				create: {
					watchedBountyIds: [],
					starredOrganizationIds: [],
					...args
				}
				,
				update: {
					...mutableArgs,
				}
			}
		);
	}
};

module.exports = Mutation;