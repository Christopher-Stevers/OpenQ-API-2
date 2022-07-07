const axios = require('axios');
const GET_VIEWER = require('./GET_VIEWER');
const GET_OWNER = require('./GET_OWNER');
const cookie = require('cookie-signature');
const { AuthenticationError } = require('apollo-server');
const validateOwnership = async (prId, oauthCookie) => {
	try {
		const tokenRegex = /github_oauth_token=[^\s;]+/;
		const signedGithubOauthToken = oauthCookie.match(tokenRegex)[0].slice(19);
		const githubOauthToken = cookie.unsign(signedGithubOauthToken.slice(4), process.env.COOKIE_SIGNER);
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

};
module.exports = validateOwnership;