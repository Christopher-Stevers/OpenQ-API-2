
const AuthenticationError = require('apollo-server');
const { verifySignature } = require('../../utils/auth/verifySignature');

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

	starOrg: async (parent, args, { req, prisma }) => {
		if (!verifySignature(req, args.address)) {
			throw new AuthenticationError();
		}

		await prisma.user.upsert({
			where: { address: args.address },
			update: {
				starredOrganizationIds: {
					push: args.id,
				},
			},
			create: {
				address: args.address,
				starredOrganizationIds: [args.id],
			},
		});

		const organization = await prisma.organization.update({
			where: { id: args.id },
			data: {
				starringUserIds: {
					push: args.address,
				},
			},
		});

		return organization;



	},
	unStarOrg: async (parent, args, { req, prisma }) => {
		if (!verifySignature(req, args.address)) {
			throw new AuthenticationError();
		}
		const organization = await prisma.organization.upsert({
			where: { id: args.id },
			update: {},
			create: { id: args.id, blacklisted: false, }
		});
		const user = await prisma.user.findUnique({
			where: { address: args.address },
		});
		const newOrgs = user.starredOrganizationIds.filter(
			(bountyId) => bountyId !== organization.id
		);
		const newUsers = organization.starringUserIds.filter(
			(userId) => userId !== user.address
		);

		await prisma.user.update({
			where: { address: args.address },
			data: {
				starredOrganizationIds: { set: newOrgs },
			},
		});
		return prisma.organization.update({
			where: { id: args.id },
			data: {
				starringUserIds: { set: newUsers },
			},
		});
	}
};

module.exports = Mutation;