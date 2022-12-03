const VIEWER_CAN_ADMINISTER_REPOSITORY = `query VIEWER_CAN_ADMINISTER_REPOSITORY($repoId: ID!) {
  node(id: $repoId) {
    ...on Repository {
      viewerCanAdminister
    }
  }
}`;

module.exports = VIEWER_CAN_ADMINISTER_REPOSITORY;