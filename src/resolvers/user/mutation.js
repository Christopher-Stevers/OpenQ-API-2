
const { AuthenticationError } = require('apollo-server');

const Mutation = {
	upsertUser: async (parent, args, { req, prisma, emailClient, githubClient }) => {
		const noIdentifier = !(args.email || args.github);
		if (noIdentifier) {
			throw new Error('Must provide id, email, address, or github');
		}

		let identifier;

		if (args.email !== undefined) {
			try {
				const emailIsValid = await emailClient.verifyEmail(req, args.email);
				if (!emailIsValid) {
					throw new AuthenticationError('Email not authorized');
				}
				identifier = {email: args.email};
			} catch (error) {
				throw new AuthenticationError(error);
			}
		}

		if (args.github !== undefined) {
			try {
				const githubIsValid = await githubClient.verifyGithub(req, args.github);
				if (!githubIsValid) {
					throw new AuthenticationError('Github not authorized');
				}
				identifier = {github: args.github};
			} catch (error) {
				throw new AuthenticationError(error);
			}
		}

		return prisma.user.upsert({
			where: {
				...identifier
			},
			create: {
				...args
			},
			update: {
				...args
			}
		});
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