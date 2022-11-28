const { PrismaClient } = require('../../generated/client');
const { BetaAnalyticsDataClient } = require('@google-analytics/data');
const { verifySignature } = require('../utils/auth/address/verifySignature');
const { verifyEmail } = require('../utils/auth/email/verifyEmail');

const prisma = new PrismaClient();
const gAnalyticsDataClient = new BetaAnalyticsDataClient();

const createContext = async ({ req, res }) => {
	console.log(req.body);
	return { req, res, prisma, gAnalyticsDataClient, verifySignature, verifyEmail };
};

module.exports = createContext;
