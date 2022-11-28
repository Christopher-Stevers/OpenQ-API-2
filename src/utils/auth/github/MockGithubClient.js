const MockGithubClient = {
	isValidGithub: true,
	get isValidGithub() {
		return isValidGithub;
	},
	set isValidGithub(bool) {
		isValidGithub = bool;
	},
	verifyGithub: async (email) => {
		return new Promise(async (resolve, reject) => {
			resolve(isValidGithub);
		});
	},
};

module.exports = MockGithubClient;