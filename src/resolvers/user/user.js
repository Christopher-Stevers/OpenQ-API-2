const User = {
	watchedBounties: async (parent, args) => {
		return {
			organizationId: parent.organizationId,
			addresses: parent.watchedBountyIds,
			...args,
		};
	},
	createdBounties: async (parent, args) => {
		return {
			organizationId: parent.organizationId,
			addresses: parent.createdBounties.map((b) => b.address),
			...args,
		};
	},

	starredOrganizations: async (parent, args) => {
		return { ...args, organizationIds: parent.starredOrganizationIds };
	},
	requests: async (parent, args) => {
		return { ...args, ids: parent.requestIds };
	},
};

module.exports = User;
