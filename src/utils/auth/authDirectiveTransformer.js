const { mapSchema, getDirective, MapperKind } = require('@graphql-tools/utils');
const { defaultFieldResolver } = require('graphql');
const { verifySignature } = require('./verifySignature');
const { AuthenticationError } = require('apollo-server');

function authDirectiveTransformer(schema, directiveName) {

	return mapSchema(schema, {
		[MapperKind.OBJECT_FIELD]: (fieldConfig) => {
			const upperDirective = getDirective(schema, fieldConfig, directiveName)?.[0];
			if (upperDirective) {
				const { resolve = defaultFieldResolver } = fieldConfig;
				fieldConfig.resolve = async function (parent, args, context, info) {
					try {
						if (context.req.headers.authorization === process.env.OPENQ_API_SECRET) {
							const result = await resolve(parent, args, context, info);
							return result;
						}

						const isUser = verifySignature(context.req, parent.address);

						if (isUser) {
							const result = await resolve(parent, args, context, info);
							return result;
						}
					}
					catch (err) {
						throw new AuthenticationError(err);
					}
					throw new AuthenticationError('Auth error b');

				};
				return fieldConfig;
			}
		}

	});
}
module.exports = authDirectiveTransformer;