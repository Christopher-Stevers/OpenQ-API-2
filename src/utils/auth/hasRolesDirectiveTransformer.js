const { mapSchema, getDirective, MapperKind } = require('@graphql-tools/utils');
const { defaultFieldResolver } = require('graphql');
const { AuthenticationError } = require('apollo-server');
const checkUserAuth = require('../../resolvers/utils/checkUserAuth');

function hasRolesDirectiveTransformer(schema, directiveName) {

	return mapSchema(schema, {
		[MapperKind.OBJECT_FIELD]: (fieldConfig) => {
			const hasRolesDirective = getDirective(schema, fieldConfig, directiveName)?.[0];
			if (hasRolesDirective) {
				const { resolve = defaultFieldResolver } = fieldConfig;
				fieldConfig.resolve = async function (parent, args,  context, info) {
					const {req, prisma, emailClient, githubClient } = context;
					const proAccountId = args.proAccountId ? args.proAccountId : parent.proAccountId? parent.proAccountId: parent.id;
					const idObj = {};
					
					const currentGithub = args?.github ? args?.github : parent?.github ? parent.github:null;
					const currentEmail = args?.email ? args?.email : parent?.email ? parent.email: null;
					try{

						const github = 	githubClient.getGithub(req);
						console.log('my github', github);
					}
					catch(error){	
						console.log(error);		
					}

					try{
						console.log('my email', emailClient);
						const email = 	emailClient.getEmail(req);
						console.log(email, 'email');
					}
					catch(error){
						console.log(error);					
					}
						
					if(currentGithub|| currentEmail){
							
						if(currentGithub) {
							idObj.github = currentGithub;
						} else if (currentEmail) {
							idObj.email = currentEmail;
						} else {
							throw new AuthenticationError('Not logged in');                            
						}

						const {req, prisma, emailClient, githubClient } = context;
						const { error, errorMessage,  id } = await checkUserAuth(prisma, req, idObj, emailClient, githubClient);

						if (error) {
							throw new AuthenticationError(errorMessage);
						} else {
							const 		user = await prisma.user.findUnique({
								where: { id },
							});
							console.log(user);
						}


					}

					const value = await checkUserAuth(prisma, req, idObj, {githubClient, emailClient});
					//	console.log(value, 'value');
					//	console.log(proAccountId);
					const currentProAccount = await prisma.proAccount.findUnique({
						where: {id: proAccountId},
					});
					let userToUpdate ={};
					switch(args.role){
				
					case 'MEMBER':
						if(!currentProAccount.adminUserIds.includes(args.currentUserId)){
							console.log('isn\'t member');
							throw new AuthenticationError('LACKS_PERMISSIONS');
						}
						userToUpdate = {memberUsers: {connect: {id: args.targetUserId}}};
						console.log(userToUpdate);
					}
				
					try {

						const result = await resolve(parent, args, context, info);
						return result;
						
					} catch (error) {
						throw new AuthenticationError(error);
					}
				};
				return fieldConfig;
			}
		}
	});
}
module.exports = hasRolesDirectiveTransformer;