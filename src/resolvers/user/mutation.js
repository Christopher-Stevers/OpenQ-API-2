
const { AuthenticationError } = require('apollo-server');

const Mutation = {
	upsertUser: async (parent, args, { req, prisma, emailClient, githubClient }) => {
		console.log(args);
		const noIdentifier = !(args.email || args.github);
		if (noIdentifier) {
			throw new Error('Must provide id, email, or github');
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
				console.log(req.headers);
				console.log(args.github);
				console.log('githubClient', githubClient);
				const githubIsValid = await githubClient.verifyGithub(req, args.github);
				console.log('githubIsValid', githubIsValid);
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