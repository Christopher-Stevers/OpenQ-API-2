const { AuthenticationError } = require('apollo-server');

const checkUserAuth = async (prisma, req, args, emailClient, githubClient) => {
	const noIdentifier = !(args.email || args.github);
	if (noIdentifier) {
		throw new Error('Must provide a an email OR github');
	}

	let identifier;

	if (args.email !== undefined) {
		try {
			const emailIsValid = await emailClient.verifyEmail(req, args.email);
			if (!emailIsValid) {
				throw new AuthenticationError('Email not authorized');
			}
			identifier = { email: args.email };
		} catch (error) {
			throw new AuthenticationError(error);
		}
	}

	if (args.github !== undefined) {
		try {
			const githubIsValid = await githubClient.verifyGithub(req, args.github);
			if (!githubIsValid) {
				throw new AuthenticationError('Github not authorized');
			}
			identifier = { github: args.github };
		} catch (error) {
			throw new AuthenticationError(error);
		}
	}

	return identifier;
};

module.exports = checkUserAuth;