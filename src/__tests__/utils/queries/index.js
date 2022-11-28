const { gql } = require('@apollo/client');


const CREATE_NEW_BOUNTY = gql`
mutation CreateBounty( $address: String!, $organizationId: String!, $bountyId: String!, $repositoryId: String!,  $type: String!) {
  createBounty(address: $address, organizationId: $organizationId, bountyId: $bountyId, repositoryId: $repositoryId, type: $type) {
    address
		bountyId
		organizationId
		repositoryId
		type
  }
}`;

const UPDATE_BOUNTY = gql`
mutation UpdateBounty( $address: String!, $organizationId: String!, $bountyId: String!, $repositoryId: String!,  $type: String!) {
  createBounty(address: $address, organizationId: $organizationId, bountyId: $bountyId, repositoryId: $repositoryId, type: $type) {
    address
		bountyId
		organizationId
		repositoryId
		type
  }
}`;

const CREATE_NEW_REPOSITORY = gql`
mutation CreateRepository( $organizationId: String!, $repositoryId: String!, $bountyId: String!) {
  createBounty(organizationId: $organizationId, repositoryId: $repositoryId, bountyId: $bountyId) {
    id
		participants
		organization
		bounties
  }
}`;

const GET_REPOSITORY = gql`
mutation GetRepository( $id: String!) {
  getRepository(id: $id) {
    id
		participants
		organization
		bounties
  }
}`;

const WATCH_BOUNTY = gql` mutation AddUser($contractAddress: String, $userAddress: String) {
  watchBounty(
    contractAddress: $contractAddress
    userAddress: $userAddress
  ) {
    address
	watchingUserIds
  }
}
`;
const UNWATCH_BOUNTY = gql` mutation AddUser($contractAddress: String, $userAddress: String) {
  unWatchBounty(
    contractAddress: $contractAddress
    userAddress: $userAddress
  ) {
    address
	watchingUserIds
  }
}
`;


const GET_BOUNTY_BY_ID = gql`query bounty($contractAddress: String!) {
  bounty(address: $contractAddress) {
    tvl
		bountyId
    type
		blacklisted
    organization {
      id
    }
    repository {
      id
    }
  }
}`;

const GET_USER_BY_HASH = gql`query($userAddress: String!) {
  user(address: $userAddress) {
    address
  }
}`;

const UPDATE_USER = gql`mutation UpdateUser( $address: String!) {
  updateUser(address: $address) {
    address
  }
}`;

const CREATE_USER_WITH_EMAIL = gql`mutation CreateUser( $email: String!) {
  createUser(email: $email) {
    id
		email
  }
}`;

const GET_USER_WITH_EMAIL = gql`query GetUser( $email: String!) {
  user(email: $email) {
		email
  }
}`;

const GET_BOUNTY_PAGE = gql`
query BountiesConnection($after: ID, $limit: Int!, $orderBy: String, $sortOrder: String, $organizationId: String) {
  bountiesConnection(after: $after, limit: $limit, orderBy: $orderBy, sortOrder: $sortOrder, organizationId: $organizationId) {
    bounties {
      tvl
			address
			organizationId
			bountyId
    }
		cursor
  }
}
`;

module.exports = { CREATE_NEW_BOUNTY, WATCH_BOUNTY, UNWATCH_BOUNTY, GET_USER_WITH_EMAIL, GET_BOUNTY_BY_ID, CREATE_USER_WITH_EMAIL, GET_USER_BY_HASH, GET_BOUNTY_PAGE, CREATE_NEW_REPOSITORY, GET_REPOSITORY, UPDATE_BOUNTY, UPDATE_USER };