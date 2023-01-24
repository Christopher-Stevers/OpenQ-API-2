
const { AuthenticationError } = require('apollo-server');

const Mutation = {
	createRequest: async (parent, args, {  prisma, req }) => {
		if (req.headers.authorization !== process.env.OPENQ_API_SECRET) {
			throw new AuthenticationError();
		}
		return prisma.request.create({
			data: {
				bounty:{
					connect: {
						address: args.bountyAddress
					}
				},
				requestingUser: {
					connect: {
						id: args.requestingUserId
					}
				},
			}
		});
	},
};

module.exports = Mutation;