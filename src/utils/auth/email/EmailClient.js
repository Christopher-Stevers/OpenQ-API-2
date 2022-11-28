const EmailClient = {
	isValidEmail: true,
	get isValidEmail() {
		return isValidEmail;
	},
	set isValidEmail(bool) {
		isValidEmail = bool;
	},
	verifyEmail: async (issueId) => {
		return new Promise(async (resolve, reject) => {
			resolve(isValidEmail);
		});
	},
};

module.exports = EmailClient;