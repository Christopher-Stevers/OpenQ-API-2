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
						}
						else{
							const {req, prisma, emailClient, githubClient } = context;
							const user = await checkUserAuth  (prisma, req, args, emailClient, githubClient);
							const {error} = user;
							if(error){                        
								throw new AuthenticationError(error);
							}
							else
							{
								const result = await resolve(parent, args, context, info);
								return result;
							}
						}
					}
					catch (err) {
						throw new AuthenticationError(err);
					}

				};
				return fieldConfig;
			}
		}

	});
}
module.exports = authDirectiveTransformer;