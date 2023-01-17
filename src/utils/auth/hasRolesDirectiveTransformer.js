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
		
					

					const github= await 	githubClient.getGithub(req);
				

					const	email = 	await emailClient.getEmail(req);			
					
					const identity = github ? {github} : email ? {email} : null;
					if(github|| email){					
						const user = await prisma.user.findUnique({
							where: identity,
						});
						const {adminOrganizationIds, memberOrganizationIds, ownerOrganizationIds} = user;


					

						switch(args.role){
				
						case 'MEMBER':
							if(!memberOrganizationIds.includes(proAccountId)){
								throw new AuthenticationError('LACKS_MEMBER_PERMISSIONS');
							}
							break;
						
						
						case 'OWNER':
							if(!ownerOrganizationIds.includes(proAccountId)){
								throw new AuthenticationError('LACKS_OWNER_PERMISSIONS');
							}
							break;
						
						case 'ADMIN':
							if(!adminOrganizationIds.includes(proAccountId)){
								throw new AuthenticationError('LACKS_ADMIN_PERMISSIONS');
							
							}
						}
						
		

						const result = await resolve(parent, args, context, info);
						return result;
				
					}
					else{
						throw new AuthenticationError('NOT_LOGGED_IN');
					}
				};
				return fieldConfig;
			}
		}
	});
}
module.exports = hasRolesDirectiveTransformer;