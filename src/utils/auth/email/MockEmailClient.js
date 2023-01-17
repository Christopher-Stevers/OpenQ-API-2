const MockEmailClient = {
	isValidEmail: true,
	get isValidEmail() {
		return isValidEmail;
	},
	set isValidEmail(bool) {
		isValidEmail = bool;
	},
	verifyEmail: async (email) => {
		return new Promise(async (resolve, reject) => {
			resolve(isValidEmail);
		});
	},
	getEmail(req) {	

		return isValidEmail ? process.env.EMAIL: '';
	}
};

module.exports = MockEmailClient;