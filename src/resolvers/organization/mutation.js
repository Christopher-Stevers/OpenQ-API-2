const { AuthenticationError } = require('apollo-server');
const checkUserAuth = require('../utils/userAuth');

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
	starOrg: async (parent, args, { req, prisma, githubClient, emailClient }) => {
		const identifier = await checkUserAuth(req, args, emailClient, githubClient);

		const user = await prisma.user.findUnique({
			where: { ...identifier }
		});
		console.log(user);

		if (user.starredOrganizationIds.includes(args.organizationId)) {
			throw new Error('ALREADY_STARRED');
		}

		await prisma.user.upsert({
			where: identifier,
			update: {
				starredOrganizationIds: {
					push: args.organizationId,
				},
			},
			create: {
				...identifier,
				starredOrganizationIds: [args.organizationId],
			},
		});

		console.log(args.userId);

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
	unStarOrg: async (parent, args, { req, prisma, githubClient, emailClient }) => {
		const identifier = await checkUserAuth(req, args, emailClient, githubClient);

		const organization = await prisma.organization.upsert({
			where: { id: args.organizationId },
			update: {},
			create: { id: args.organizationId, blacklisted: false, }
		});

		const user = await prisma.user.findUnique({
			where: identifier,
		});

		const newOrgs = user.starredOrganizationIds.filter(
			(bountyId) => bountyId !== organization.organizationId
		);

		const newUsers = organization.starringUserIds.filter(
			(userId) => userId !== user.id
		);

		await prisma.user.update({
			where: identifier,
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