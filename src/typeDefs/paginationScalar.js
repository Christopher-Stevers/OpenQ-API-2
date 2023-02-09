const { createIntScalar } = require('graphql-scalar');
const Int = createIntScalar({
	name: 'Int',
	min: 1,
	max: 100,
});

module.exports = [Int];
