import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

console.log(" [DB] Initializing database connection...");
console.log(" [DB] Database URL:", process.env.DATABASE_URL?.substring(0, 30) + "...");

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});
console.log(" [DB] PostgreSQL connection pool created");

const adapter = new PrismaPg(pool);
console.log(" [DB] Prisma adapter initialized");

const prisma = new PrismaClient({
  adapter,
  log: ["query", "error", "warn"],
});
console.log(" [DB] Prisma client created with logging enabled");
console.log(" [DB] Database connection ready!");

export default prisma;
