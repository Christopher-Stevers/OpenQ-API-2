const GET_BOUNTY_DEPOSITS_DATA = `
query{
	 deposits{volume
	   tokenAddress
	   bounty{
		   bountyId
	   }
	 
   }
}  
`
const UPDATE_BOUNTY = `mutation Mutation($bountyId: String!, $tvl: Float!) {
	updateBounty(bountyId: $bountyId, tvl: $tvl) {
		bountyId
	}
  }`

module.exports = { GET_BOUNTY_DEPOSITS_DATA, UPDATE_BOUNTY }
