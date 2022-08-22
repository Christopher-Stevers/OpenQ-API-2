const Organization = {
	bounties: async (parent, args) => {
		return { organizationId: parent.id, ...args };
	}


};

module.exports = Organization;