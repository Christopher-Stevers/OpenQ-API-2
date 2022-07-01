const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const createContext = async ({ req, res }) => {
	return { req, res, prisma };
};

module.exports = createContext;
