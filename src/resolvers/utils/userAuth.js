/**
 * 
 * @param {Prisma} prisma The Prisma client
 * @param {Object} req The request object
 * @param {Object} args The arguments passed to the mutation
 * @param {Object} emailClient The email client
 * @param {Object} githubClient The github client
 * @returns If valid, returns userId. If invalid, returns an error message.
 */
const checkUserAuth = async (prisma, req, args, emailClient, githubClient) => {
	const noIdentifier = !(args.email || args.github);
	if (noIdentifier) {
		return { error: true, errorMessage: 'Must provide a an email OR github' };
	}

	let userId = null;

	if (args.email !== undefined) {
		try {
			const emailIsValid = await emailClient.verifyEmail(req, args.email);
			if (!emailIsValid) {
				return { error: true, errorMessage: 'Email not authorized' };
			}
			const user = await prisma.user.findUnique({ where: { email: args.email } });
			if (user) {
				userId = user.id;
			}
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
			const user = await prisma.user.findUnique({ where: { github: args.github } });
			if (user) {
				userId = user.id;
			}
		} catch (error) {
			return { error: true, errorMessage: error };
		}
	}

	return { error: false, errorMessage: null, id: userId, github: args.github, email: args.email };
};

module.exports = checkUserAuth;