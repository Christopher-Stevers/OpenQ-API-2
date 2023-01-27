const runReport = require('./runReport');

const Bounty = {
	views: async (parent, args, { gAnalyticsDataClient }) => {
		const matchingStr = `/contract/${parent.bountyId}/${parent.address}`;
		const propertyId = process.env.PROPERTY_ID;
		const response = await runReport(
			gAnalyticsDataClient,
			propertyId,
			matchingStr
		);
		const rows = response.rows.map((row) => {
			return {
				page: row.dimensionValues[0].value,
				viewers: row.metricValues[0].value,
			};
		});
		const viewers =
			rows.find((row) => row.page === matchingStr)?.viewers || 0;
		return viewers;
	},
	watchingCount: async (parent) => {
		return parent.watchingUserIds.length;
	},
	creatingUser: async (parent, args, { prisma }) => {
		return prisma.user.findUnique({
			where: { id: parent.creatingUserId },
			include: { createdBounties: true, starredOrganizations: true },
		});
	},
};

module.exports = Bounty;
