const checkUserAuth = require('../utils/checkUserAuth');
const { AuthenticationError } = require('apollo-server');

const Mutation = {
	upsertUser: async (parent, args, { req, prisma, emailClient, githubClient }) => {
		const { error, errorMessage, github, email, username } = await checkUserAuth(prisma, req, args, emailClient, githubClient);
		
		if (error) {
			throw new AuthenticationError(errorMessage);
		}

		if (github) {
			return prisma.user.upsert({
				where: { github },
				create: {
					...args,
					username
				},
				update: {
					...args,
					username
				}
			});
		}

		if (email) {
			return prisma.user.upsert({
				where: { email },
				create: {
					...args,
					username

				},
				update: {
					...args,
					username
				}
			});
		}
	},
	updateUser: async (parent, args, { req, prisma, emailClient, githubClient }) => {
		const { error, errorMessage, github, email } = await checkUserAuth(prisma, req, args, emailClient, githubClient);

		if (error) {
			throw new AuthenticationError(errorMessage);
		}

		if (github) {
			return prisma.user.upsert({
				where: { github },
				create: {
					...args
				},
				update: {
					...args
				}
			});
		}

		if (email) {
			return prisma.user.upsert({
				where: { email },
				create: {
					...args
				},
				update: {
					...args
				}
			});
		}
	},
	combineUsers: async (parent, args, { req, prisma, emailClient, githubClient }) => {

		const {github, email} = args;

		const { error, errorMessage } = await checkUserAuth(prisma, req, args, emailClient, githubClient);

		if (error) {
			throw new AuthenticationError(errorMessage);
		}

		const user = await prisma.user.findUnique({
			where: { github },
		});

		const userToCombine = await prisma.user.findUnique({
			where: { email: email },
		});

		if (userToCombine) {
			const userBounties = user.watchedBountyIds||[];
			const userToCombineBounties = userToCombine.watchedBountyIds||[];
			const newBounties = userBounties.concat(userToCombineBounties);
			const newBountiesSet = new Set(newBounties);
			const newBountiesArray = Array.from(newBountiesSet);
			const userOrgs = user.starredOrganizationIds||[];
			const userToCombineOrgs = userToCombine.starredOrganizationIds||[];

			const newOrgs = userOrgs.concat(userToCombineOrgs);
			const newOrgsSet = new Set(newOrgs);
			const newOrgsArray = Array.from(newOrgsSet);
			const newUserToCombine = {};
			for(let key in userToCombine){
				if(key !== 'id' && userToCombine[key] !== null){
					newUserToCombine[key] = userToCombine[key];
				}
			}




			const newUser = {};
			for(let key in user){
				if(key !== 'id' && user[key] !== null){
					newUser[key] = user[key];
				}
			}

			const combinedUser = { ...newUserToCombine, ...newUser, watchedBountyIds: newBountiesArray, starredOrganizationIds: newOrgsArray };
			delete newUser.id;
			// delete the user that was combined
			await prisma.user.delete({
				where: { email: email
				}
			});

			// update the user that was combined into
			return  await prisma.user.update({
				where: { github },
				data: combinedUser
			});
            



		}
		return user;

	}

};

module.exports = Mutation;