const axios = require('axios');
const GET_VIEWER = require('./GET_VIEWER');
const GET_OWNER = require('./GET_OWNER');

const cookie = require('cookie-signature');
const { AuthenticationError } = require('apollo-server');
const Mutation = {
	createPr: async (parent, args, { prisma }) => {
		const { thumbnail, bountyAddress, prId } = args;
		return prisma.pr.create({
			data: {
				prId,
				thumbnail,
				bountyAddress,

			},
		});
	},
	updatePr: async (parent, args, { prisma }) => {
		const { prId, contributorIds } = args;
		return prisma.pr.update({
			where: { prId },
			data: {
				contributorIds
			},
		});
	},

	addContributor: async (parent, args, { req, prisma }) => {
		const { prId, userId, address } = args;
		try {
			const tokenRegex = /github_oauth_token=[^\s;]+/;
			const signedGithubOauthToken = req.headers.cookie.match(tokenRegex)[0].slice(19);
			console.log(signedGithubOauthToken.slice(2), process.env.COOKIE_SIGNER);
			const githubOauthToken = cookie.unsign(signedGithubOauthToken.slice(4), process.env.COOKIE_SIGNER);
			console.log(githubOauthToken);
			console.log(prId);
			const resultViewer = await axios
				.post(
					'https://api.github.com/graphql',
					{
						query: GET_VIEWER
					},
					{
						headers: {
							'Authorization': 'token ' + githubOauthToken,
						},
					}
				);

			const viewer = resultViewer.data.data.viewer.login;
			const ownerResult = await axios
				.post(
					'https://api.github.com/graphql',
					{
						query: GET_OWNER,
						variables: { id: prId }
					},
					{
						headers: {
							'Authorization': 'token ' + githubOauthToken,
						},
					}
				);
			const owner = ownerResult.data.data.node.author.login;
			if (owner !== viewer) {
				throw new AuthenticationError();
			}
		} catch (err) {
			throw new AuthenticationError();
		}
		await prisma.contributor.upsert({

			where: { userId },
			update: {
				prIds: { push: prId }
			},
			create: {
				userId, address, prIds: { set: [prId] }
			}

		});

		return prisma.pr.update({
			where: { prId },
			data: {
				contributorIds: { push: userId }
			},
		});
	},

	removeContributor: async (parent, args, { req, prisma }) => {
		const { prId, userId } = args;
		try {
			const tokenRegex = /github_oauth_token=[^\s;]+/;
			const signedGithubOauthToken = req.headers.cookie.match(tokenRegex)?.[0].slice(19);

			console.log(signedGithubOauthToken.slice(2), process.env.COOKIE_SIGNER);
			const githubOauthToken = cookie.unsign(signedGithubOauthToken.slice(2), process.env.COOKIE_SIGNER);
			console.log(githubOauthToken);
			console.log(prId);
			const resultViewer = await axios
				.post(
					'https://api.github.com/graphql',
					{
						query: GET_VIEWER
					},
					{
						headers: {
							'Authorization': 'token ' + githubOauthToken,
						},
					}
				);
			const viewer = resultViewer.data.data.viewer.login;
			const ownerResult = await axios
				.post(
					'https://api.github.com/graphql',
					{
						query: GET_OWNER,
						variables: { id: prId }
					},
					{
						headers: {
							'Authorization': 'token ' + githubOauthToken,
						},
					}
				);
			const owner = ownerResult.data.data.node.author.login;
			if (owner !== viewer) {
				throw new AuthenticationError();
			}
		}
		catch (err) {
			throw new AuthenticationError();
		}
		const contributor = await prisma.contributor.findUnique({
			where: { userId },
		});
		const pr = await prisma.pr.findUnique({
			where: { prId },
		});
		await prisma.contributor.update({
			where: { userId },
			data: {
				prIds: { push: prId }
			},
		});
		const newContributorIds = pr.contributorIds.filter(id => id !== userId);
		const newPrIds = contributor.prIds.filter(id => id !== prId);
		await prisma.contributor.update({
			where: { userId },
			data: {
				prIds: { set: newPrIds }
			}
		});
		return prisma.pr.update({
			where: { prId },
			data: {
				contributorIds: { set: newContributorIds }
			},
		});
	},
};

module.exports = Mutation;