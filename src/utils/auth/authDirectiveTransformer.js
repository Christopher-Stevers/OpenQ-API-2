const { mapSchema, getDirective, MapperKind } = require('@graphql-tools/utils');
const { defaultFieldResolver } = require('graphql');
const checkUserAuth = require('../../resolvers/utils/checkUserAuth');
const { AuthenticationError } = require('apollo-server');

function authDirectiveTransformer(schema, directiveName) {

	return mapSchema(schema, {
		[MapperKind.OBJECT_FIELD]: (fieldConfig) => {
			const authDirective = getDirective(schema, fieldConfig, directiveName)?.[0];
			if (authDirective) {
				const { resolve = defaultFieldResolver } = fieldConfig;
				fieldConfig.resolve = async function (parent, args, context, info) {
					try {
						const idObj = {};
						const currentGithub = args ? args.github : parent ? parent.github:null;
						const currentEmail = args ? args.email : parent ? parent.email: null;

						if(currentGithub|| currentEmail){
							
							if(currentGithub) {
								idObj.github = currentGithub;
							} else if (currentEmail) {
								idObj.email = currentEmail;
							} else {
								throw new AuthenticationError('Not logged in');                            
							}

							const {req, prisma, emailClient, githubClient } = context;
							
							const { error, errorMessage, username, id } = await checkUserAuth(prisma, req, idObj, emailClient, githubClient);

							if (error) {
								throw new AuthenticationError(errorMessage);
							} else {
								const result = await resolve(parent, args, {...context, username, id,}, info);
								return result;
							}


						}
						if (context.req.headers.authorization === process.env.OPENQ_API_SECRET) {
							const {req, prisma, emailClient, githubClient } = context;
							const { username, id } = await checkUserAuth(prisma, req,  emailClient, githubClient);

							const result = await resolve(parent, args, {...context, username, id,}, info);
							return result;
						} 
					} catch (error) {
						throw new AuthenticationError(error);
					}
				};
				return fieldConfig;
			}
		}
	});
}
module.exports = authDirectiveTransformer;