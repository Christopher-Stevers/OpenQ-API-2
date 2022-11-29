
const { AuthenticationError } = require('apollo-server');

const Mutation = {
	createUser: async (parent, args, { req, prisma, verifySignature, emailClient, githubClient }) => {
		const incorrectApiSecret = req.headers.authorization !== process.env.OPENQ_API_SECRET;
		if (incorrectApiSecret) {
			throw new AuthenticationError();
		}
		
		const noIdentifier = !(args.email || args.address || args.github);
		if (noIdentifier) {
			throw new Error('Must provide id, email, address, or github');
		}

		if (args.address !== undefined) {
			const addressWithInvalidSignature =  !verifySignature(req, args.address);
			if (addressWithInvalidSignature) {
				throw new AuthenticationError(`Signature for address ${args.address} is invalid`);
			}
		}

		if (args.email !== undefined) {
			const emailIsValid = await emailClient.verifyEmail(req, args.email);
			if (!emailIsValid) {
				throw new AuthenticationError('Email not authorized');
			}
		}

		if (args.github !== undefined) {
			try {
				const githubIsValid = await githubClient.verifyGithub(req, args.github);
				if (!githubIsValid) {
					throw new AuthenticationError('Github not authorized');
				}
			} catch (error) {
				throw new AuthenticationError(error);
			}
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