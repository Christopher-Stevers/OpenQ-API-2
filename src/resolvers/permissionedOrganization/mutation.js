const { AuthenticationError } = require('apollo-server');
const checkUserAuth = require('../utils/checkUserAuth');

const Mutation = {
	createPermissionedOrganization: async (parent, args, { req, prisma, emailClient, githubClient  }) => {
		
		const { error, errorMessage } = await checkUserAuth(prisma, req, args, emailClient, githubClient);

		if (error) {
			throw new AuthenticationError(errorMessage);
		}


		return prisma.permissionedOrganization.create({
			
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
	addProductToPermissionedOrganization: async (parent, args, { req, prisma,   }) => {
		if (req.headers.authorization !== process.env.OPENQ_API_SECRET) {
			throw new AuthenticationError();
		}


		return prisma.permissionedOrganization.update({
			where:{id: args.permissionedOrganizationId},
			data:{
				permissionedProducts: {
					connect: {id: args.productId}
				}
			}
			

		});
	},
	addUserToPermissionedOrgWithRole: async (parent, args, {  prisma,   }) => {
		const currentPermissionedOrganization = await prisma.permissionedOrganization.findUnique({
			where: {id: args.permissionedOrganizationId},
		});
		let userToUpdate ={};

		switch(args.role){
		case 'ADMIN':
			if(!currentPermissionedOrganization.ownerUserIds.includes(args.currentUserId)){
				throw new AuthenticationError('LACKS_PERMISSIONS');
			}
			userToUpdate = {adminUsers: {connect: {id: args.targetUserId}},
				memberUsers: {connect: {id: args.targetUserId}}};
			break;
		case 'MEMBER':
			if(!currentPermissionedOrganization.adminUserIds.includes(args.currentUserId)){		
				throw new AuthenticationError('LACKS_PERMISSIONS');
			}
			userToUpdate = {memberUsers: {connect: {id: args.targetUserId}}};
		}
		
		return prisma.permissionedOrganization.update({
			where:{id: args.permissionedOrganizationId},
			data:{
				...userToUpdate
			}
	

		});


	}
};

module.exports = Mutation;