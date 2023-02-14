
/**
 * 
 * @param {Prisma} prisma The Prisma client
 * @param {Object} req The request object
 * @param {Object} args The arguments passed to the mutation
 * @param {Object} emailClient The email client
 * @param {Object} githubClient The github client
 * @returns If valid, returns userId. If invalid, returns an error message.
 */
const checkUserAuth = async (prisma, req, args, emailClient, githubClient, options) => {

	const noIdentifier = !(args.email || args.github);
	if (noIdentifier) {
		return { error: true, errorMessage: 'Must provide a an email OR github' };
	}

	let userId = null;
	let username = null;
	const needsBoth =options?.operationName === 'combineUsers';
	
	if(req?.headers?.authorization===process.env.OPENQ_API_SECRET){
		let idObj={};
		if(args.github){
			idObj.github = args.github;
		}
		if(args.email){
			idObj.email = args.email;
		}
		if(Object.keys(idObj).length!==0){
			return idObj;
		}
	}
	if (args.email && args.github && !needsBoth) {
		// if users have same id

		const emailUser = await prisma.user.findUnique({ where: { email: args.email } });

		const githubUser = await prisma.user.findUnique({ where: { github: args.github } });
		// users are combined
		if (emailUser?.id === githubUser?.id) {
			userId = emailUser.id;
        
			let emailIsValid, githubIsValid;
			try{
			
				emailIsValid = await emailClient.verifyEmail(req, args.email);
			
				githubIsValid = await githubClient.verifyGithub(req, args.github);
			}
			catch(error){
				console.log(error, 'error checking auth of user with multiple auth strategies.');
			}
			
			if (!emailIsValid && !githubIsValid) {
				if (!githubIsValid) {
					return { error: true, errorMessage: 'Github not authorized when logging to user with multiple auth sources.' };
				}
				if (!emailIsValid) {
					return { error: true, errorMessage: 'Email not authorized when logging to user with multiple auth sources.' };
				}
			}
		}
		else {
			return { error: true, errorMessage: 'Email and github users do not match.' };
		}
	}
	else{
		if (args.email !== undefined) {
			try {
				const emailIsValid = await emailClient.verifyEmail(req, args.email);
				if (!emailIsValid) {
					return { error: true, errorMessage: 'Email not authorized' };
				}
				const user = await prisma.user.findUnique({ where: { email: args.email } });
				userId = user ? user.id : null;
				username = args.email;
			} catch (error) {
				return { error: true, errorMessage: error };
			}
		}

		if (args.github !== undefined) {
			try {
				const { githubIsValid, login } = await githubClient.verifyGithub(req, args.github);
				if (!githubIsValid) {
					return { error: true, errorMessage: 'Github not authorized' };
				}
				const user = await prisma.user.findUnique({ where: { github: args.github } });
				userId = user ? user.id : null;
				username = login;
			} catch (error) {
				return { error: true, errorMessage: error };
			}
		}
	}
	return { error: false, errorMessage: null, id: userId, github: args.github, username, email: args.email };
};

module.exports = checkUserAuth;