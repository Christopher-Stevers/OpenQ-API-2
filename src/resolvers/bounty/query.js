const Query = {
	bounty: async (_, args, { prisma }) =>{
		const bounty =await  prisma.bounty.findUnique({
			where: { address: args.address },
			include: { repository: true, organization: true, watchingUsers: true, request: true},
		});
		return bounty;
	},
	bounties: async (parent, args) => {
		return args;
	}
};

module.exports = Query;