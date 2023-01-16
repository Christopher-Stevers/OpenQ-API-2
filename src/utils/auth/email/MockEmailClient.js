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

		return process.env.EMAIL;
	}
};

module.exports = MockEmailClient;