
const { AuthenticationError } = require('apollo-server');
const { verifyGithubOwnership } = require('../../utils/auth/github/verifyGithubOwnership');
const { verifySignature } = require('../../utils/auth/verifySignature');

const Mutation = {
	createUserWithEmail: async (parent, args, { req, prisma }) => {
		// create with email
		return prisma.user.create({
			data: {
				email: args.email
			},
		});
	},
	updateUser: async (parent, args, { req, prisma }) => {
		if (!verifySignature(req, args.address)) {
			throw new AuthenticationError();
		}

		const mutableArgs = { ...args };
		delete mutableArgs.address;

		return prisma.user.upsert(
			{
				where: {
					address: args.address,
				},
				create: {
					watchedBountyIds: [],
					starredOrganizationIds: [],
					...args
				},
				update: {
					...mutableArgs,
				}
			}
		);
	},
	updateUserGithubWithAddress: async (parent, args, { req, prisma }) => {
		// Verify that the caller owns the address
		if (!verifySignature(req, args.address)) {
			throw new AuthenticationError();
		}

		// Verify that the user owns the GitHub account
		if (!verifyGithubOwnership(req, args.github)) {
			throw new AuthenticationError();
		}

		// verify uniqueness, AKA that this Github account is not already associated with another address

		const mutableArgs = { ...args };
		delete mutableArgs.address;

		return prisma.user.upsert(
			{
				where: {
					address: args.address,
				},
				create: {
					watchedBountyIds: [],
					starredOrganizationIds: [],
					...args
				},
				update: {
					...mutableArgs,
				}
			}
		);
	},
	updateUserSimple: async (parent, args, { prisma }) => {
		const mutableArgs = { ...args };
		delete mutableArgs.address;

		return prisma.user.upsert(
			{
				where: {
					address: args.address,
				},
				create: {
					watchedBountyIds: [],
					starredOrganizationIds: [],
					...args
				},
				update: {
					...mutableArgs,
				}
			}
		);
	}
};

module.exports = Mutation;