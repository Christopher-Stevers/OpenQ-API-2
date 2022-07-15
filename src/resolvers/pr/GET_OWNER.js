const GET_OWNER = `
query getPr($id: ID!){
 node(id: $id) {
    ... on PullRequest {
      id
      bodyHTML
			url
      title
			author{
				login
        avatarUrl
      	url
        ... on User {
          id
					twitterUsername
				}
			}
      }
    }
  }
`;




module.exports = GET_OWNER;