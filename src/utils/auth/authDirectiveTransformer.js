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
						if (context.req.headers.authorization === process.env.OPENQ_API_SECRET) {
							const result = await resolve(parent, args, context, info);
							return result;
						} else {
							const idObj = {};
							if(parent.github) {
								idObj.github = parent.github;
							} else if (parent.email) {
								idObj.email = parent.email;
							} 

							const {req, prisma, emailClient, githubClient } = context;
							
							const { error, errorMessage } = await checkUserAuth(prisma, req, idObj, emailClient, githubClient);

							if (error) {
								throw new AuthenticationError(errorMessage);
							} else {
								const result = await resolve(parent, args, context, info);
								return result;
							}
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