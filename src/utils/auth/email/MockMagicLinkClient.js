class MockMagicLinkClient {
	isValidToken;
	isViewersEmail;
	
	constructor() {
		this.isValidToken = true;
		this.isViewersEmail = true;
	}

	setIsValidToken = (_isValidToken) => {
		this.isValidToken = _isValidToken;
	};

	setIsViewersEmail = (_isViewersEmail) => {
		this.isViewersEmail = _isViewersEmail;
	};

	token = {
		validate: async (token) => {
			if (this.isValidToken) {
				return new Promise((resolve, reject) => {
					resolve(true);
				});
			} else {
				return new Promise((resolve, reject) => {
					reject('Invalid DID Token');
				});
			}
		}
	};
	
	users = {
		getMetadataByToken: async (token) => {
			return new Promise((resolve) => {
				const email = this.isViewersEmail ? process.env.EMAIL : process.env.OTHER_EMAIL;
				resolve({
					email
				});
			});
		}
	};
}

module.exports = MockMagicLinkClient;