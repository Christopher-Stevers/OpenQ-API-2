const verifyGithubOwnership = require('./verifyGithubOwnership');
const getGithubFromCookie = require('./getGithubFromCookie');
const verifyUserCanAdministerRepository = require('./verifyUserCanAdministerRepository');
const verifyUserIsSubmissionAuthor = require('./verifyUserIsSubmissionAuthor');

const GithubClient = {
	verifyGithub: async (req, github) => {
		return new Promise(async (resolve, reject) => {
			try {
				const result = await verifyGithubOwnership(req, github);
				resolve(result);
			} catch (error) {
				return reject(error);
			}
		});
	},
	getGithub(req) {
		return new Promise(async (resolve, reject) => {
			

			try {
				const result = await getGithubFromCookie(req);
				resolve(result);
			} catch (error) {
				return reject(error);
			}
		

		
		});
	},
	

	verifyUserCanAdministerRepository: async (req, repoId) => {
		return new Promise(async (resolve, reject) => {
			try {
				const result = await verifyUserCanAdministerRepository(req, repoId);
				resolve(result);
			} catch (error) {
				return reject(error);
			}
		});
	},
	verifyUserIsSubmissionAuthor: async (req, submissionId) => {
		return new Promise(async (resolve, reject) => {
			try {
				const result = await verifyUserIsSubmissionAuthor(req, submissionId);
				resolve(result);
			} catch (error) {
				return reject(error);
			}
		});
	},
};

module.exports = GithubClient;