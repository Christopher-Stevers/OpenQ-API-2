const axios = require('axios')
const fetch = require('cross-fetch')
const { ethers } = require('ethers')
const { ApolloClient, InMemoryCache, gql, HttpLink } = require('@apollo/client')
const { GET_BOUNTY_DEPOSITS_DATA, CREATE_BOUNTY } = require('./query/query')
const tokenMetadata = require('./local.json')

const subGraphClient = new ApolloClient({
    cache: new InMemoryCache(),
    link: new HttpLink({
        fetch,
        uri: 'http://localhost:8000/subgraphs/name/openqdev/openq',
    }),
})

const tvlClient = new ApolloClient({
    cache: new InMemoryCache(),
    link: new HttpLink({
        fetch,
        uri: 'http://localhost:8080/',
    }),
})

const fetchBounties = async () => {
    async function getTokenValues(tokenBalances) {
        const tokenVolumes = {}
        tokenBalances.forEach((tokenBalance) => {
            const tokenAddress =
                tokenMetadata[
                    ethers.utils.getAddress(tokenBalance.tokenAddress)
                ].address
            tokenVolumes[tokenAddress] = tokenBalance.volume
        })

        const params = { tokenVolumes, network: 'polygon-pos' }
        const url = 'http://host.docker.internal:8081/tvl'
        // only query tvl for bounties that have deposits
        if (JSON.stringify(params.tokenVolumes) !== '{}') {
            try {
                const { data } = await axios.post(url, params)
                return data
            } catch (error) {
                // continue regardless
            }
            return []
        }
        return []
    }
    const depositResponse = await subGraphClient.query({
        query: gql(GET_BOUNTY_DEPOSITS_DATA),
    })
    const { deposits } = depositResponse.data

    const tokenValues = await getTokenValues(deposits)
    const TVLS = deposits.map((tokenBalance) => {
        const tokenAddress = ethers.utils.getAddress(tokenBalance.tokenAddress)
        const tokenValueAddress = tokenMetadata[tokenAddress].address
        const { volume } = tokenBalance

        const bigNumberVolume = ethers.BigNumber.from(volume.toString())
        const decimals = parseInt(tokenMetadata[tokenAddress].decimals, 10)

        const formattedVolume = ethers.utils.formatUnits(
            bigNumberVolume,
            decimals
        )
        console.log(tokenValues)
        const totalValue =
            formattedVolume *
            tokenValues.tokenPrices[tokenValueAddress.toLowerCase()]

        return { id: tokenBalance.bounty.id, totalValue }
    })
    return TVLS
}
const updateTvls = async (values) => {
    const pending = []
    for (let i = 0; i < values.length; i += 1) {
        const value = values[i]
        const contractId = value.id
        const tvl = parseFloat(value.totalValue)
        const result = tvlClient.mutate({
            mutation: gql(CREATE_BOUNTY),
            variables: { contractId, tvl },
        })
        pending.push(result)
    }
    console.log(await Promise.all(pending))
    const resolved = await Promise.all(pending)
    console.log(resolved)
}
const indexer = async () => {
    const TVLS = await fetchBounties()
    await updateTvls(TVLS)
}

module.exports = indexer
