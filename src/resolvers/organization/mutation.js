const { AuthenticationError } = require('apollo-server');

const Mutation = {
	blacklistOrg: async (parent, args, { req, prisma }) => {
		if (req.headers.authorization !== process.env.BANHAMMER) {
			throw new AuthenticationError('UNAUTHENTICATED');
		}
		return prisma.organization.upsert(
			{
				where: { id: args.organizationId },
				create: { blacklisted: args.blacklist, id: args.organizationId },
				update: { blacklisted: args.blacklist }
			}
		);
	},
	starOrg: async (parent, args, {  prisma, id,  }) => {

		const user = await prisma.user.findUnique({
			where: { id }
		});

		if (user.starredOrganizationIds.includes(args.organizationId)) {
			throw new Error('ALREADY_STARRED');
		}

		await prisma.user.update({
			where: { id },
			data: {
				starredOrganizationIds: {
					push: args.organizationId,
				},
			}
		});

		const organization = await prisma.organization.update({
			where: { id: args.organizationId },
			data: {
				starringUserIds: {
					push: args.userId,
				},
			},
		});

		return organization;
	},
	unstarOrg: async (parent, args, { id, prisma,  }) => {
		// upsert organization
		await prisma.organization.upsert({
			where: { id: args.organizationId },
			create: { id: args.organizationId },
			update: {},
		});
		const organization = await prisma.organization.findUnique({
			where: { id: args.organizationId },
		});
        

	

		const user = await prisma.user.findUnique({
			where: { id },
		});
		const newOrgs = user.starredOrganizationIds.filter(
			(organizationId) => organizationId !== organization.id
		);
		const newUsers = organization.starringUserIds.filter(
			(userId) => userId !== user.id
		);

		await prisma.user.update({
			where: { id },
			data: {
				starredOrganizationIds: { set: newOrgs },
			},
		});

		return prisma.organization.update({
			where: { id: args.organizationId },
			data: {
				starringUserIds: { set: newUsers },
			},
		});
	}
};

module.exports = Mutation;