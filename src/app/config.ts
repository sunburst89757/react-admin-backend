import dotenv from "dotenv";
import fs from "fs";
import path from "path";
dotenv.config();
export const PRIVATE_KEY = fs.readFileSync(
  path.resolve(__dirname, "../../keys/rsa_private_key.pem")
);
export const PUBLIC_KEY = fs.readFileSync(
  path.resolve(__dirname, "../../keys/rsa_public_key.pem")
);
//  白名单添加的是角色id
export const WHITE_LIST = [1];
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
