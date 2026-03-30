import { PrismaClient } from "@prisma/client";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";

const globalForPrisma = globalThis as unknown as {
    prisma: PrismaClient | undefined;
};

function getPrismaClient() {
    if (globalForPrisma.prisma) {
        return globalForPrisma.prisma;
    }
    // console.log(process.env.DATABASE_URL);
    const pool = new Pool({
        connectionString: process.env.DATABASE_URL,
    });

    const adapter = new PrismaPg(pool);

    const prisma = new PrismaClient({ adapter });

    if (process.env.NODE_ENV !== "production") {
        globalForPrisma.prisma = prisma;
    }

    return prisma;
}

const prisma = getPrismaClient();

export default prisma;