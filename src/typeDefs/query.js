const { gql } = require('apollo-server');

const query = gql`
  type Query {
    info: String!
    test: String
  }
`;

module.exports = query;