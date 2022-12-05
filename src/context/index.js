const { PrismaClient } = require('../../generated/client');
const { BetaAnalyticsDataClient } = require('@google-analytics/data');

const prisma = new PrismaClient();
const gAnalyticsDataClient = new BetaAnalyticsDataClient();

const createContext = async ({ req, res }) => {

	return { req, res, prisma, gAnalyticsDataClient };
};

module.exports = createContext;
