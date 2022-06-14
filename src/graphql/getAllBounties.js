const { gql } = require('@apollo/client');

const GET_BOUNTY_DEPOSITS_DATA = `
query{
	 deposits{volume
	   tokenAddress
	   bounty{
			id
	   }
	 
   }
}  
`;
const UPDATE_BOUNTY = `mutation Mutation($contractAddress: String!, $tvl: Float!) {
	updateBounty(contractAddress: $contractAddress, tvl: $tvl) {
		contractAddress
	}
  }`;

const CREATE_BOUNTY = `mutation CreateBounty($tvl: Float!, $id: String!) {
        createBounty(tvl: $tvl, contractAddress: $id) {
            contractAddress
        }
    }
`;

module.exports = { GET_BOUNTY_DEPOSITS_DATA, UPDATE_BOUNTY, CREATE_BOUNTY };

const GET_ALL_BOUNTIES = gql`
	query GetAllIssues($sortOrder: String!, $skip: Int!, $quantity: Int!) {
		bounties(skip: $skip, sortOrder: $sortOrder, quantity: $quantity) {
			bountyAddress
			bountyId
			bountyTokenBalances {
				volume
				tokenAddress
			}
		}
	}
`;
module.exports = GET_ALL_BOUNTIES;
