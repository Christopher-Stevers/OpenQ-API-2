
const checkRepositoryAdmin = require('../utils/checkRepositoryAdmin');
const { AuthenticationError } = require('apollo-server');

const Mutation = {

	addUserToSubmission: async (parent, args, { req, prisma, githubClient }) => {
		const { error, errorMessage, viewerCanAdminister } = await checkRepositoryAdmin(req, args, githubClient);

		if (error) {
			throw new AuthenticationError(errorMessage);
		}

		if (!viewerCanAdminister) {
			throw new AuthenticationError(`User is not authorized to administer repository with id ${args.repositoryId}`);
		}

		const { submissionId, userId } = args;
		await prisma.user.update({

			where: { id: userId },
			data: {
				submissionIds: { push: submissionId }
			}

		});

		return prisma.submission.upsert({
			where: {id: submissionId },
			create: {
				id:submissionId,
				bountyAddress: args.bountyAddress,
				userIds: { set: [userId] },
				repository: {
					connect:{                
						id: args.repositoryId
					}
				}
			},
			update: {
				userIds: { push: userId }
			},
		});
	},

	upsertSubmission: async (parent, args, { req, prisma, githubClient }) => {
    
		const { error, errorMessage, viewerCanAdminister } = await checkRepositoryAdmin(req, args, githubClient);

		if (error) {
			throw new AuthenticationError(errorMessage);
		}

		if (!viewerCanAdminister) {
			throw new AuthenticationError(`User is not authorized to administer repository with id ${args.repositoryId}`);
		}

		const { submissionId, repositoryId, ...remainingArgs } = args;
		return prisma.submission.upsert({
			where: { id: submissionId },
			create: {
				id: submissionId,
				repository: {
					connect:{
						id: repositoryId
					}
				},            
				...remainingArgs
			},
			update: {
				...remainingArgs
			},
		});
	},

	removeUserFromSubmission: async (parent, args, { req, prisma, githubClient }) => {
	
		const { error, errorMessage, viewerCanAdminister } = await checkRepositoryAdmin(req, args, githubClient);

		if (error) {
			throw new AuthenticationError(errorMessage);
		}

		if (!viewerCanAdminister) {
			throw new AuthenticationError(`User is not authorized to administer repository with id ${args.repositoryId}`);
		}
		const { submissionId, userId } = args;
		const user = await prisma.user.findUnique({
			where: { id: userId },
		});
		const submission = await prisma.submission.findUnique({
			where: { id: submissionId },
		});
		const newUserIds = submission.userIds.filter(id => {
		
			return id !== userId;});
		const newSubmissionsIds = user.submissionIds.filter(id => id !== submissionId);
		const newUSer = 	await prisma.user.update({
			where: { id:userId },
			data: {
				submissionIds: { set: newSubmissionsIds }, 
				Submissions: {
					disconnect:[{id: submissionId}]}
			}
		});
    
		const updatedSubmission = await  prisma.submission.update({
			where: { id: submissionId },
			data: {
				userIds: { set: newUserIds },
				users: {
					disconnect:[{id: userId}]}
            
			},
		});
		return updatedSubmission;
	},
};

module.exports = Mutation;