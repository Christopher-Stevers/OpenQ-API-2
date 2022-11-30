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

const WATCH_BOUNTY = gql`mutation AddUser($contractAddress: String, $userId: String) {
  watchBounty(
    contractAddress: $contractAddress
    userId: $userId
  ) {
    address
		watchingUserIds
  }
}`;

const CREATE_USER = gql`mutation CreateUser($github: String!) {
  upsertUser(github: $github) {
    id
    github
  }
}`;

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

const UPSERT_USER = gql`mutation UpsertUser($email: String, $github: String) {
  upsertUser(email: $email, github: $github) {
    id
		email
		github
  }
}`;

const GET_USER = gql`query GetUser($id: String, $email: String, $github: String) {
  user(id: $id, email: $email, github: $github) {
		id
		email
		github
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

module.exports = { CREATE_NEW_BOUNTY, WATCH_BOUNTY, UNWATCH_BOUNTY, GET_USER, CREATE_USER, GET_BOUNTY_BY_ID, UPSERT_USER, GET_BOUNTY_PAGE, CREATE_NEW_REPOSITORY, GET_REPOSITORY, UPDATE_BOUNTY };