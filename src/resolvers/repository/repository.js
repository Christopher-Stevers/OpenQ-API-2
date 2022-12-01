const Repository = {
	bounties: async (parent, args) => {
		return { repositoryId: parent.id, ...args };
	}
};

module.exports = Repository;