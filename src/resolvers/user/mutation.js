const checkUserAuth = require('../utils/userAuth');
const { AuthenticationError } = require('apollo-server');

const Mutation = {
	upsertUser: async (parent, args, { req, prisma, emailClient, githubClient }) => {
		const { error, errorMessage, id, github, email } = await checkUserAuth(prisma, req, args, emailClient, githubClient);

		if (error) {
			throw new AuthenticationError(errorMessage);
		}

		if (github) {
			return prisma.user.upsert({
				where: { github },
				create: {
					...args
				},
				update: {
					...args
				}
			});
		}

		if (email) {
			return prisma.user.upsert({
				where: { email },
				create: {
					...args
				},
				update: {
					...args
				}
			});
		}
	}
};

module.exports = Mutation;