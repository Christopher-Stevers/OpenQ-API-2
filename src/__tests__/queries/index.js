const { gql } = require('@apollo/client');


const CREATE_NEW_BOUNTY = gql`
mutation CreateBounty( $address: String!, $organizationId: String!, $bountyId: String!) {
  createBounty(address: $address, organizationId: $organizationId, bountyId: $bountyId) {
    address
		bountyId
		organizationId
  }
}`;

const WATCH_BOUNTY = gql` mutation AddUser($contractAddress: String, $userAddress: String, $signature: String) {
  watchBounty(
    contractAddress: $contractAddress
    userAddress: $userAddress
    signature: $signature
  ) {
    address
	watchingUserIds
  }
}
`;
const UNWATCH_BOUNTY = gql` mutation AddUser($contractAddress: String, $userAddress: String, $signature: String) {
  unWatchBounty(
    contractAddress: $contractAddress
    userAddress: $userAddress
    signature: $signature
  ) {
    address
	watchingUserIds
  }
}
`;


const GET_BOUNTY_BY_HASH = gql`query bounty($contractAddress: String! ) {
  bounty(address: $contractAddress) {
    tvl
		bountyId
    watchingUserIds
  }
}`;

const GET_USER_BY_HASH = gql`query($userAddress: String!) {
  user(address: $userAddress) {
    watchedBountyIds
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

module.exports = { CREATE_NEW_BOUNTY, WATCH_BOUNTY, UNWATCH_BOUNTY, GET_BOUNTY_BY_HASH, GET_USER_BY_HASH, GET_BOUNTY_PAGE };