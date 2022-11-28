
const { AuthenticationError } = require('apollo-server');

const Mutation = {
	createUser: async (parent, args, { req, prisma, verifySignature, emailClient }) => {
		const incorrectApiSecret = req.headers.authorization !== process.env.OPENQ_API_SECRET;
		if (incorrectApiSecret) {
			throw new AuthenticationError();
		}
		
		const noIdentifier = !(args.email || args.address || args.github);
		if (noIdentifier) {
			throw new Error('Must provide id, email, address, or github');
		}

		const addressWithInvalidSignature = args.address && !verifySignature(req, args.address);
		if (addressWithInvalidSignature) {
			throw new AuthenticationError();
		}

		const emailIsValid = await emailClient.verifyEmail(args.email);
		const emailWithoutAuthorization = args.email && !emailIsValid;
		if (emailWithoutAuthorization) {
			throw new AuthenticationError('Email not authorized');
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