const { gql } = require('apollo-server-express');

// Basic schema

const typeDefs = gql`
	scalar PaginationInt
`;
module.exports = typeDefs;
