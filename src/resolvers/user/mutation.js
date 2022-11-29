
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
	}
};

module.exports = Mutation;