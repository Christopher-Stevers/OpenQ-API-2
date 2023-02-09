const { GraphQLScalarType, Kind } = require('graphql');
const Constants = require('../../../constants/ratelimiting');

function PaginationIntValue(value) {
	if (
		value >= Constants.paginationLower &&
		value <= Constants.paginationUpper
	) {
		return value;
	}

	throw new Error(
		`limit only accepts values between ${Constants.paginationLower} and ${Constants.paginationUpper}: `
	);
}

const PaginationInt = new GraphQLScalarType({
	name: 'PaginationInt',

	description: 'PaginationInt custom scalar type',

	parseValue: PaginationIntValue,

	serialize: PaginationIntValue,

	parseLiteral(ast) {
		if (ast.kind === Kind.INT) {
			console.log(ast.value);
			return PaginationIntValue(parseInt(ast.value, 10));
		}

		throw new Error('PaginationInt can only parse integer values');
	},
});
module.exports = PaginationInt;
