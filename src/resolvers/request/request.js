
const Request = {
	bounty: async (parent, args, {prisma}) => {
		return  prisma.bounty.findUnique({ where: { address: parent.bountyAddress }, include: { organization: true, repository: true, watchingUsers: true, requests: true } });
	},
	requestingUser: async (parent, args, {prisma} ) => {
		return prisma.user.findUnique({where: {id: parent.requestingUserId} });
	}
};

module.exports = Request;