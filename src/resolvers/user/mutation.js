
const checkUserAuth = require('../utils/userAuth');

const Mutation = {
	upsertUser: async (parent, args, { req, prisma, emailClient, githubClient }) => {
		const identifier = await checkUserAuth(req, args, emailClient, githubClient);

		return prisma.user.upsert({
			where: identifier,
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