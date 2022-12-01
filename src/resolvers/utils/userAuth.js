const { AuthenticationError } = require('apollo-server');

const checkUserAuth = async (prisma, req, args, emailClient, githubClient) => {
	const noIdentifier = !(args.email || args.github);
	if (noIdentifier) {
		return { error: true, errorMessage: 'Must provide a an email OR github' };
	}

	let identifier;

	if (args.email !== undefined) {
		try {
			const emailIsValid = await emailClient.verifyEmail(req, args.email);
			if (!emailIsValid) {
				return { error: true, errorMessage: 'Email not authorized' };
			}
			identifier = { email: args.email };
		} catch (error) {
			return { error: true, errorMessage: error };
		}
	}

	if (args.github !== undefined) {
		try {
			const githubIsValid = await githubClient.verifyGithub(req, args.github);
			if (!githubIsValid) {
				return { error: true, errorMessage: 'Github not authorized' };
			}
			identifier = { github: args.github };
		} catch (error) {
			return { error: true, errorMessage: error };
		}
	}

	return { error: false, errorMessage: null, ...identifier };
};

module.exports = checkUserAuth;