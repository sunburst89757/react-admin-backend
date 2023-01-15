import { createClient } from "redis";
import JWTR from "jwt-redis";
import { REDIS_URL } from "../app/config";

const client = createClient({
  url: REDIS_URL,
});

client.on("error", (err) => console.log("Redis Client Error", err));
client.connect().then(() => {
  console.log("redis connect success");
});
// @ts-ignore
export const jwtr = new JWTR(client);
