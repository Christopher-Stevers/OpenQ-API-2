const ProAccount = {
	
	adminUsers: async (parent, args,) => {
		return { ...args, userIds: parent.adminUserIds };

	},
	memberUsers: async (parent, args,) => {
		return { ...args, userIds: parent.memberUserIds };

	},
	ownerUsers: async (parent, args,) => {
		return { ...args, userIds: parent.ownerUserIds };

	},
	permissionedProducts: async (parent, args,) => {
		return { ...args, id: parent.permissionedProductIds };

	}



};

module.exports = ProAccount;