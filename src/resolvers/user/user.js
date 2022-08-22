

const User = {
	watchedBounties: async (parent, args) => {
		return { organizationId: parent.id, addresses: parent.watchedBountyIds, ...args };
	}
};

module.exports = User;