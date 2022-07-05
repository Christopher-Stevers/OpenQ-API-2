const mutationDefs = require('./mutation.js');
const typeDef = require('./type');
const queryDef = require('./query');

module.exports = [
	mutationDefs,
	typeDef,
	queryDef
];