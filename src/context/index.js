const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const createContext = async ({ req }) => {
	return { req, prisma };
};

module.exports = createContext;
