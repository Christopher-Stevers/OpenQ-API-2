const mutationDefs = require('./mutation');
const typeDef = require('./type');
const queryDef = require('./query');

module.exports = [
	mutationDefs,
	typeDef,
	queryDef
];