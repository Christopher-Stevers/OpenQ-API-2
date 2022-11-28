const { PrismaClient } = require('../../generated/client');
const { BetaAnalyticsDataClient } = require('@google-analytics/data');
const { verifySignature } = require('../utils/auth/address/verifySignature');

const EmailClient = require('../utils/auth/email/EmailClient');
const MockEmailClient = require('../utils/auth/email/MockEmailClient');

const GithubClient = require('../utils/auth/github/GithubClient');
const MockGithubClient = require('../utils/auth/github/MockGithubClient');

const prisma = new PrismaClient();
const gAnalyticsDataClient = new BetaAnalyticsDataClient();

const createContext = async ({ req, res }) => {
	console.log(req.body);
	return { req, res, prisma, gAnalyticsDataClient, verifySignature, emailClient: EmailClient, githubClient: GithubClient };
};

const createMockContext = async ({ req, res }) => {
	console.log(req.body);
	// headers come in as strings, so we need to cast the 'emailisvalid' header to a boolean
	MockEmailClient.isValidEmail = req.headers.emailisvalid === 'true';
	MockGithubClient.isValidGithub = req.headers.githubisvalid === 'true';
	return { req, res, prisma, gAnalyticsDataClient, verifySignature, emailClient: MockEmailClient, githubClient: MockGithubClient };
};

module.exports = { createContext, createMockContext };
