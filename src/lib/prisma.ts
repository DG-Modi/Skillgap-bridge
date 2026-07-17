import { PrismaClient } from '@prisma/client';
import { PrismaMariaDb } from '@prisma/adapter-mariadb';

// Helper to parse MySQL connection parameters from URL
const getDbConnectionOptions = () => {
  const urlString = process.env.DATABASE_URL || 'mysql://root:@localhost:3306/skillgap_ai';
  try {
    const parsed = new URL(urlString);
    return {
      host: parsed.hostname || 'localhost',
      port: parsed.port ? Number(parsed.port) : 3306,
      user: parsed.username || 'root',
      password: decodeURIComponent(parsed.password || ''),
      database: parsed.pathname.slice(1) || 'skillgap_ai',
      connectionLimit: 10,
    };
  } catch (err) {
    console.error('Failed to parse DATABASE_URL, using defaults:', err);
    return {
      host: 'localhost',
      port: 3306,
      user: 'root',
      password: '',
      database: 'skillgap_ai',
      connectionLimit: 10,
    };
  }
};

const adapter = new PrismaMariaDb(getDbConnectionOptions());

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };

export const prisma = globalForPrisma.prisma || new PrismaClient({ adapter });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
