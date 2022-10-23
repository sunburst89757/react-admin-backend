import { PrismaClient } from "@prisma/client";

const db = new PrismaClient({
  log: [
    {
      emit: "event",
      level: "query",
    },
    {
      emit: "stdout",
      level: "error",
    },
    {
      emit: "stdout",
      level: "info",
    },
    {
      emit: "stdout",
      level: "warn",
    },
  ],
  errorFormat: "pretty",
});

db.$connect().catch((err) => {
  console.log("database error \n");
  console.error(err);
});

export { db };
