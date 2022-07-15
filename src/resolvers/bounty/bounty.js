const runReport = require('./runReport');

const Bounty = {
	watchingUsers: async (parent, args, { prisma }) => {
		const cursor = args.after ? { address: args.after } : undefined;
		const users = await prisma.user.findMany({
			skip: args.after ? 1 : 0,
			cursor,
			take: args.limit,
			...(args.orderBy && args.sortOrder) && {
				orderBy: [
					{ [args.orderBy]: args.sortOrder },
					{ [args.orderBy && 'address']: args.orderBy && 'asc' },
				],
			},
			include: { watchedBounties: true },
			where: { address: { in: parent.watchingUserIds } },
		});
		const newCursor =
			users.length > 0 ? users[users.length - 1].address : null;
		return {
			users,
			cursor: newCursor,
		};
	},
	views: async (parent, args, { gAnalyticsDataClient }) => {
		const matchingStr = `/bounty/${parent.bountyId}/${parent.address}`;
		const propertyId = process.env.PROPERTY_ID;
		const response = await runReport(gAnalyticsDataClient, propertyId, matchingStr);
		const rows = response.rows.map(row => {
			return { page: row.dimensionValues[0].value, viewers: row.metricValues[0].value };
		});
		const viewers = rows.find(row => row.page === matchingStr)?.viewers || 0;
		return viewers;
	}
};

module.exports = Bounty;