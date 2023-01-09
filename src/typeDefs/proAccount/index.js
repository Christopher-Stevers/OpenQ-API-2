const mutationDefs = require('./mutation.js');
const typeDef = require('./type.js');
const queryDef = require('./query.js');

module.exports = [
	mutationDefs,
	typeDef,
	queryDef
];