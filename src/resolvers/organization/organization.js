const Organization = {
	bounties: async (parent, args) => {
		return { organizationId: parent.id, ...args };
	},
	repositories: async (parent, args) => {
		return { organizationId: parent.id, ...args };
	},
	starringUsers: async (parent, args,) => {
		return { ...args, userIds: parent.starringUserIds };

	}



};

module.exports = Organization;