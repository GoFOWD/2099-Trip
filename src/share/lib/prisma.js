import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis;

export const prisma =
	globalForPrisma.prisma ||
	new PrismaClient({
		log: ['query', 'info', 'warn', 'error'] // 필요하면 조정
	});

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

export default prisma;
