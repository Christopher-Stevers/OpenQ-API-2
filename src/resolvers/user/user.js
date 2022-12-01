const User = {
	watchedBounties: async (parent, args) => {
		return { organizationId: parent.organizationId, addresses: parent.watchedBountyIds, ...args };
	}
};

module.exports = User;