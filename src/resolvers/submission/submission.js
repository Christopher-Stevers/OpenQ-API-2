const Submission = {

	users: async (parent, args, { prisma }) => {
		return prisma.user.findMany({ where: {
			id: {in: parent.userIds }
		} });
	}
};
module.exports = Submission;