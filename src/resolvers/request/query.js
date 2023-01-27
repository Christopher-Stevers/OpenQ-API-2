const Query = {
	request: async (_, args, { prisma }) =>{
		const	request = await prisma.request.findUnique({
			where: { id: args.id },
		});
		return request;
	},
	requests: async (parent, args) => {
		return args;
	}
};

module.exports = Query;