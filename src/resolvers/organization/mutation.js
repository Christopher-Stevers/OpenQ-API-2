
const AuthenticationError = require('apollo-server');

const Mutation = {
	blackListOrg: async (parent, args, { req, prisma }) => {
		if (req.headers.authorization !== process.env.BANHAMMER) {
			throw new AuthenticationError();
		}
		return prisma.organization.upsert(
			{
				where: { id: args.organizationId },
				create: { blacklisted: args.blackList, id: args.organizationId },
				update: { blacklisted: args.blackList }
			}
		);
	},
};

module.exports = Mutation;