const User = {
	watchedBounties: async (parent, args) => {
		return { organizationId: parent.organizationId, addresses: parent.watchedBountyIds, ...args };
	},

	starredOrganizations: async (parent, args,) => {
		return { ...args, organizationIds: parent.starredOrganizationIds };
	}
};

module.exports = User;