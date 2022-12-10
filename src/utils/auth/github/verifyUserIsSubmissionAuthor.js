// Third Party
const axios = require('axios');

// Issue Query
const VERIFY_USER_IS_PR_AUTHOR = require('./query/VERIFY_USER_IS_PR_AUTHOR');

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
const verifyUserIsSubmissionAuthor = async (req, submissionId) => {
	return new Promise(async (resolve, reject) => {
		try {
			const signatureRegex = /github_oauth_token_unsigned=\w+/;
			const regexMatch = req.headers.cookie.match(signatureRegex);
			
			let token;
			if (regexMatch === null) {
				return reject(NO_GITHUB_OAUTH_TOKEN({ id: submissionId }));
			} else {
				token = req.headers.cookie.match(signatureRegex)[0].slice(28);
			}
			
			const resultViewerIsPRAuthor = await axios
				.post(
					'https://api.github.com/graphql',
					{
						query: VERIFY_USER_IS_PR_AUTHOR,
						variables: { submissionId }
					},
					{
						headers: {
							'Authorization': 'token ' + token,
						},
					}
				);

			if (resultViewerIsPRAuthor.data.errors && resultViewerIsPRAuthor.data.errors[0].type == 'RATE_LIMITED') {
				return reject(RATE_LIMITED({ id: submissionId }));
			}

			const prAuthor = resultViewerIsPRAuthor.data.data.node.author.login;
			const viewerLogin = resultViewerIsPRAuthor.data.data.viewer.login;

			if (viewerLogin == prAuthor) {
				return resolve(true);
			} else {
				return reject(INVALID_GITHUB_OAUTH_TOKEN({viewerUserId: viewerLogin, id: submissionId}));
			}
		} catch (error) {
			if (error.response && error.response.status == 401) {
				return reject(GITHUB_OAUTH_TOKEN_LACKS_PRIVILEGES({ id: submissionId }));
			}
			return reject(UNKNOWN_ERROR({ id: submissionId, error }));
		}
	});
};

module.exports = verifyUserIsSubmissionAuthor;