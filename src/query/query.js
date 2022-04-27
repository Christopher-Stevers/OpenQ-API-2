const GET_BOUNTY_DEPOSITS_DATA = `
query{
	 deposits{volume
	   tokenAddress
	   bounty{
			contractId
	   }
	 
   }
}  
`
const UPDATE_BOUNTY = `mutation Mutation($contractId: String!, $tvl: Float!) {
	updateBounty(contractId: $contractId, tvl: $tvl) {
		contractId
	}
  }`

module.exports = { GET_BOUNTY_DEPOSITS_DATA, UPDATE_BOUNTY }
