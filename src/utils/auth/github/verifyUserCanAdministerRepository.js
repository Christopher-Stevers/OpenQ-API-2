// Third Party
const axios = require('axios');

// Issue Query
const VIEWER_CAN_ADMINISTER_REPOSITORY = require('./query/VIEWER_CAN_ADMINISTER_REPOSITORY');

// Errors
const {
	GITHUB_OAUTH_TOKEN_LACKS_PRIVILEGES,
	UNKNOWN_ERROR,
	RATE_LIMITED,
	INVALID_GITHUB_OAUTH_TOKEN,
	NO_GITHUB_OAUTH_TOKEN
} = require('./errors/errors');

/***
 *  Verifies the OAuth token holder matches 
 * ***/
const verifyUserCanAdministerRepository = async (req, repoId) => {
	// eslint-disable-next-line no-async-promise-executor
	return new Promise(async (resolve, reject) => {
		try {
			const signatureRegex = /github_oauth_token_unsigned=\w+/;
			const regexMatch = req.headers.cookie.match(signatureRegex);
			
			let token;
			if (regexMatch === null) {
				return reject(NO_GITHUB_OAUTH_TOKEN({ id: repoId }));
			} else {
				token = req.headers.cookie.match(signatureRegex)[0].slice(28);
			}
			const resultViewerCanAdminister = await axios
				.post(
					'https://api.github.com/graphql',
					{
						query: VIEWER_CAN_ADMINISTER_REPOSITORY,
						variables: { repoId }
					},
					{
						headers: {
							'Authorization': 'token ' + token,
						},
					}
				);

			if (resultViewerCanAdminister.data.errors && resultViewerCanAdminister.data.errors[0].type == 'RATE_LIMITED') {
				return reject(RATE_LIMITED({ id: repoId }));
			}

			const verifyUserCanAdministerRepository = resultViewerCanAdminister.data.data.node.viewerCanAdminister;
			const viewerLogin = resultViewerCanAdminister.data.data.viewer.login;

			if (verifyUserCanAdministerRepository) {
				return resolve(true);
			} else {
				return reject(INVALID_GITHUB_OAUTH_TOKEN({viewerUserId: viewerLogin, id: repoId}));
			}
		} catch (error) {
			if (error.response && error.response.status == 401) {
				return reject(GITHUB_OAUTH_TOKEN_LACKS_PRIVILEGES({ id: repoId }));
			}
			return reject(UNKNOWN_ERROR({ id: repoId, error }));
		}
	});
};

module.exports = verifyUserCanAdministerRepository;