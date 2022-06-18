const { gql } = require('apollo-server');

const mutation = gql`
  type Mutation {
    root: String
  }
`;

module.exports = mutation;