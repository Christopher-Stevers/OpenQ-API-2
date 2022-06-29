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

module.exports = { CREATE_NEW_BOUNTY, WATCH_BOUNTY, UNWATCH_BOUNTY };