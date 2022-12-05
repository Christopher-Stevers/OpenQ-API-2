const Organization = {
	bounties: async (parent, args) => {
		return { organizationId: parent.id, ...args };
	},
	repositories: async (parent, args) => {
		console.log(parent, args);
		return { organizationId: parent.id, ...args };
	}



};

module.exports = Organization;