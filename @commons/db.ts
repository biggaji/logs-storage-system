import { PrismaClient } from "@prisma/client";

const dbClient = new PrismaClient();

try {
  await dbClient.$connect();
  console.log(`Database connected...`)
} catch (error: any) {
  await dbClient.$disconnect();
  console.log(`Database disconnected: ${error.name} <> ${error.message}`)
}

export default dbClient;