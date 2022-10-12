import { PrismaClient } from "@prisma/client";

const db = new PrismaClient();

db.$connect().catch((err) => {
  console.log("database error \n");
  console.error(err);
});

export { db };
