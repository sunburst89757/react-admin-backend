import dotenv from "dotenv";
dotenv.config();
export const {
  APP_HOST,
  APP_PORT,
  MYSQL_HOST,
  MYSQL_PORT,
  MYSQL_DATABASE,
  MYSQL_USER,
  MYSQL_PASSWORD,
  DATABASE_URL,
} = process.env;
