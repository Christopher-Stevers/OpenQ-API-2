const { PrismaClient } = require('../../generated/client');
const { BetaAnalyticsDataClient } = require('@google-analytics/data');

const EmailClient = require('../utils/auth/email/EmailClient');
const MockEmailClient = require('../utils/auth/email/MockEmailClient');

const GithubClient = require('../utils/auth/github/GithubClient');
const MockGithubClient = require('../utils/auth/github/MockGithubClient');

const prisma = new PrismaClient();
const gAnalyticsDataClient = new BetaAnalyticsDataClient();

const { Magic } = require('@magic-sdk/admin');

const createContext = async ({ req, res }) => {
	let magic = new Magic(process.env.MAGIC_SECRET_KEY);
	return { req, res, prisma, gAnalyticsDataClient, emailClient: new EmailClient(magic), githubClient: GithubClient };
};

const createMockContext = async ({ req, res }) => {
	/**
	 * Headers come in as strings
	 * We cast the 'emailisvalid' and 'githubisvalid' headers to booleans
	 * Notice theye are also LOWERCASED
	 *  */
	MockEmailClient.isValidEmail = req.headers.emailisvalid === 'true';
	MockGithubClient.isValidGithub = req.headers.githubisvalid === 'true';
	return { req, res, prisma, gAnalyticsDataClient, emailClient: MockEmailClient, githubClient: MockGithubClient };
};

module.exports = { createContext, createMockContext };
