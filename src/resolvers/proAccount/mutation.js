const { AuthenticationError } = require('apollo-server');
const checkUserAuth = require('../utils/checkUserAuth');

const Mutation = {
	createProAccount: async (parent, args, { req, prisma, emailClient, githubClient  }) => {
		
		const { error, errorMessage } = await checkUserAuth(prisma, req, args, emailClient, githubClient);

		if (error) {
			throw new AuthenticationError(errorMessage);
		}


		return prisma.proAccount.create({
			
			data:{
				ownerUsers: {
					connect: {id: args.userId}
				},
				adminUsers: {
					connect: {id: args.userId}
				},
				memberUsers: {
					connect: {id: args.userId}
				},
				name: args.name
			}
			

		});
		
	},
	addProductToProAccount: async (parent, args, { req, prisma,   }) => {
		if (req.headers.authorization !== process.env.OPENQ_API_SECRET) {
			throw new AuthenticationError();
		}


		return prisma.proAccount.update({
			where:{id: args.proAccountId},
			data:{
				permissionedProducts: {
					connect: {id: args.productId}
				}
			}
			

		});
	},
	addUserToPermissionedOrgWithRole: async (parent, args, {  prisma,   }) => {
		const currentProAccount = await prisma.proAccount.findUnique({
			where: {id: args.proAccountId},
		});
		let userToUpdate ={};

		switch(args.role){
		case 'ADMIN':
			if(!currentProAccount.ownerUserIds.includes(args.currentUserId)){
				throw new AuthenticationError('LACKS_PERMISSIONS');
			}
			userToUpdate = {adminUsers: {connect: {id: args.targetUserId}},
				memberUsers: {connect: {id: args.targetUserId}}};
			break;
		case 'MEMBER':
			if(!currentProAccount.adminUserIds.includes(args.currentUserId)){		
				throw new AuthenticationError('LACKS_PERMISSIONS');
			}
			userToUpdate = {memberUsers: {connect: {id: args.targetUserId}}};
		}
		
		return prisma.proAccount.update({
			where:{id: args.proAccountId},
			data:{
				...userToUpdate
			}
	

		});


	}
};

module.exports = Mutation;