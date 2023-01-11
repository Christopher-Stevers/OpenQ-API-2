const User = {
	watchedBounties: async (parent, args) => {
		return { organizationId: parent.organizationId, addresses: parent.watchedBountyIds, ...args };
	},

	starredOrganizations: async (parent, args,) => {
		return { ...args, organizationIds: parent.starredOrganizationIds };
	},
	adminOrganizations: async (parent, args,) => {
		return { ...args, id: parent.adminOrganizationIds };
	},
	memberOrganizations: async (parent, args,) => {
		return { ...args, id: parent.memberOrganizationIds };
	},
	ownerOrganizations: async (parent, args,) => {	
		return { ...args, id: parent.ownerOrganizationIds };
	}

};

module.exports = User;