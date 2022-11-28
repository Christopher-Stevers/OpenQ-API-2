
const { AuthenticationError } = require('apollo-server');

const Mutation = {
	createUser: async (parent, args, { req, prisma, verifySignature }) => {
		if (req.headers.authorization !== process.env.OPENQ_API_SECRET) {
			throw new AuthenticationError();
		}
		
		if (!(args.email || args.address || args.github)) {
			throw new Error('Must provide id, email, address, or github');
		}

		if (args.address && !verifySignature(req, args.address)) {
			throw new AuthenticationError();
		}

		return prisma.user.create({
			data: {
				...args
			},
		});
	},
	updateUser: async (parent, args, { req, prisma, verifySignature }) => {
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
				},
				update: {
					...mutableArgs,
				}
			}
		);
	},
	updateUserGithubWithAddress: async (parent, args, { req, prisma, verifySignature }) => {
		// Verify that the caller owns the address
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
				},
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
				},
				update: {
					...mutableArgs,
				}
			}
		);
	}
};

module.exports = Mutation;