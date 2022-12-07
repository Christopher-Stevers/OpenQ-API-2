const { AuthenticationError } = require('apollo-server');
const checkUserAuth = require('../utils/checkUserAuth');

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
		const { error, errorMessage, id } = await checkUserAuth(prisma, req, args, emailClient, githubClient);

		if (error) {
			throw new AuthenticationError(errorMessage);
		}

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
	unstarOrg: async (parent, args, { req, prisma, githubClient, emailClient }) => {
		const { error, errorMessage, github, email, id } = await checkUserAuth(prisma, req, args, emailClient, githubClient);

		if (error) {
			throw new AuthenticationError(errorMessage);
		}

		const organization = await prisma.organization.upsert({
			where: { id: args.organizationId },
			update: {},
			create: { id: args.organizationId, blacklisted: false, }
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