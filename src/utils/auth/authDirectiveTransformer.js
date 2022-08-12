const { mapSchema, getDirective, MapperKind } = require('@graphql-tools/utils');
const { defaultFieldResolver } = require('graphql');
const { verifySignature } = require('./verifySignature');

function authDirectiveTransformer(schema, directiveName) {

	return mapSchema(schema, {
		[MapperKind.OBJECT_FIELD]: (fieldConfig) => {

			const upperDirective = getDirective(schema, fieldConfig, directiveName)?.[0];
			if (upperDirective) {
				const { resolve = defaultFieldResolver } = fieldConfig;
				fieldConfig.resolve = async function (parent, args, context, info) {
					try {
						const isUser = verifySignature(context.req, parent.address);

						if (isUser) {
							const result = await resolve(parent, args, context, info);

							return result;

						}
					}
					catch (err) {
						console.log(err);
						return null;
					}
					return null;

				};
				return fieldConfig;
			}
		}

	});
}
module.exports = authDirectiveTransformer;