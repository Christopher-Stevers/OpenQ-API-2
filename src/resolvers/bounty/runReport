async function runReport(gAnalyticsDataClient, propertyId, matchingStr) {
	const [response] = await gAnalyticsDataClient.runReport({
		property: `properties/${propertyId}`,
		dateRanges: [
			{
				startDate: '2020-03-31',
				endDate: 'today',
			},
		],
		dimensionFilter: {
			filter: {
				fieldName: 'pagePath',
				stringFilter: {
					matchType: 'BEGINS_WITH',
					value: matchingStr,
					caseSensitive: true
				}
			}
		},
		dimensions: [
			{
				name: 'pagePath',
			},
		],
		metrics: [
			{
				name: 'activeUsers',
			},
		],
	});
	return response;
}
module.exports = runReport;