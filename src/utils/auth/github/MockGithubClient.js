const MockGithubClient = {
	isValidGithub: true,
	get isValidGithub() {
		return isValidGithub;
	},
	set isValidGithub(bool) {
		isValidGithub = bool;
	},
	verifyGithub: async (req, github) => {
		return new Promise(async (resolve, reject) => {
			resolve({ githubIsValid: isValidGithub, login: process.env.GITHUB_USER_LOGIN });
		});
	},
	getGithub(req) {
		return isValidGithub ? 'MDQ6VXNlcjcyMTU2Njc5' : '';
	},
	verifyUserCanAdministerRepository: async (req, github) => {
		return new Promise(async (resolve, reject) => {
			resolve(isValidGithub);
		});
	},
	verifyUserIsSubmissionAuthor: async (req, github) => {
		return new Promise(async (resolve, reject) => {
			resolve(isValidGithub);
		});
	},
};

module.exports = MockGithubClient;