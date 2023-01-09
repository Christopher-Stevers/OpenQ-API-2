const Mutation = require('./mutation');
const Query = require('./query');
const Product = require('./product');
const Products = require('./products');

const productResolvers = {
	Mutation,
	Query,
	Product,
	Products
};

module.exports = productResolvers;