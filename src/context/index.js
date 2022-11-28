const { PrismaClient } = require('../../generated/client');
const { BetaAnalyticsDataClient } = require('@google-analytics/data');
const { verifySignature } = require('../utils/auth/address/verifySignature');
const EmailClient = require('../utils/auth/email/EmailClient');
const MockEmailClient = require('../utils/auth/email/MockEmailClient');

const prisma = new PrismaClient();
const gAnalyticsDataClient = new BetaAnalyticsDataClient();

const createContext = async ({ req, res }) => {
	console.log(req.body);
	return { req, res, prisma, gAnalyticsDataClient, verifySignature, emailClient: EmailClient };
};

const createMockContext = async ({ req, res }) => {
	console.log(req.body);
	return { req, res, prisma, gAnalyticsDataClient, verifySignature, emailClient: MockEmailClient };
};

module.exports = { createContext, createMockContext };
