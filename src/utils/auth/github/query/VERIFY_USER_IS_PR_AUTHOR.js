const VERIFY_USER_IS_PR_AUTHOR = `query VIEWER_IS_PR_AUTHOR($submissionId: ID!) {
  viewer {
    login
  }
  node(id: $submissionId) {
    ...on PullRequest {
      author {
        login
      }
    }
  }
}`;

module.exports = VERIFY_USER_IS_PR_AUTHOR;