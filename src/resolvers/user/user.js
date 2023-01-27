const User = {
	watchedBounties: async (parent, args) => {
		return {
			organizationId: parent.organizationId,
			addresses: parent.watchedBountyIds,
			...args,
		};
	},
	createdBounties: async (parent, args) => {
		console.log(parent, args);
		return {
			creatingUserId: parent.id,
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
