/**
 * 
 * @param {Object} req The request object
 * @param {Object} args The arguments passed to the mutation
 * @param {Object} githubClient The github client
 * @returns If valid, returns userId. If invalid, returns an error message.
 */
const checkRepositoryAdmin = async (req, args, githubClient) => {
	try {
		const viewerCanAdminister = await githubClient.verifyUserCanAdministerRepository(req, args.repositoryId);
		if (!viewerCanAdminister) {
			return { error: true, errorMessage: `Github not authorized to administer repository with id ${args.repositoryId}`, viewerCanAdminister: false };
		}
	} catch (error) {
		return { error: true, errorMessage: error, viewerCanAdminister: false };
	}

	return { error: false, errorMessage: null, viewerCanAdminister: true };
};

module.exports = checkRepositoryAdmin;