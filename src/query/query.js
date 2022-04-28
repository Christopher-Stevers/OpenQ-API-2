const GET_BOUNTY_DEPOSITS_DATA = `
query{
	 deposits{volume
	   tokenAddress
	   bounty{
			id
	   }
	 
   }
}  
`
const UPDATE_BOUNTY = `mutation Mutation($contractId: String!, $tvl: Float!) {
	updateBounty(contractId: $contractId, tvl: $tvl) {
		contractId
	}
  }`

const CREATE_BOUNTY = `mutation CreateBounty($tvl: Float!, $id: String!) {
        createBounty(tvl: $tvl, contractId: $id) {
            contractId
        }
    }
`

module.exports = { GET_BOUNTY_DEPOSITS_DATA, UPDATE_BOUNTY, CREATE_BOUNTY }
