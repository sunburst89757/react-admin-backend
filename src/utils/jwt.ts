import { createClient } from "redis";
import JWTR from "jwt-redis";

const client = createClient();

client.on("error", (err) => console.log("Redis Client Error", err));
client.connect().then(() => {
  console.log("redis connect success");
});
// @ts-ignore
export const jwtr = new JWTR(client);
