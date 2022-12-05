const MockMagicLinkClient = {
	isValidToken: true,
	get isValidToken() {
		return isValidToken;
	},
	set isValidToken(bool) {
		isValidToken = bool;
	},
	auth: {
		verifyToken: async (token) => {
			return new Promise(async (resolve, reject) => {
				resolve(isValidToken);
			});
		},
	}
};

module.exports = MockMagicLinkClient;