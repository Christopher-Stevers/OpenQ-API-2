// Third Party
const axios = require('axios');
const getGithubOAuthToken  =require( './getGithubOAuthToken.js');

// Issue Query
const GET_VIEWER = require('./query/GET_VIEWER');

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
const getGithubFromCookie = async (req,) => {
	// eslint-disable-next-line no-async-promise-executor
	return new Promise(async (resolve, reject) => {
		try {

			const token = getGithubOAuthToken(req);
			
			if (token === null) {
				return reject(NO_GITHUB_OAUTH_TOKEN({ userId: '' }));
			} 
			const resultViewer = await axios
				.post(
					'https://api.github.com/graphql',
					{
						query: GET_VIEWER
					},
					{
						headers: {
							'Authorization': 'Bearer ' + token,
						},
					}
				);
			if (resultViewer.data.errors && resultViewer.data.errors[0].type == 'RATE_LIMITED') {
				return reject(RATE_LIMITED({ userId: '' }));
			}

			const viewerUserId = resultViewer.data.data.viewer.id;

			if (viewerUserId ) {
				return resolve(viewerUserId);
			} else {
				return resolve('');
				
			}
		} catch (error) {
			if (error.response && error.response.status == 401) {
				return reject(INVALID_GITHUB_OAUTH_TOKEN({ userId: ''}));
			}
			return reject(UNKNOWN_ERROR({ userId: '', error }));
		}
	});
};

module.exports = getGithubFromCookie;