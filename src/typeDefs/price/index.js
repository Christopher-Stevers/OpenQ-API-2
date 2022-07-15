const typeDef = require('./type');
const queryDef = require('./query');
const mutationDefs = require('./mutation');

module.exports = [
	typeDef,
	queryDef,
	mutationDefs,
];