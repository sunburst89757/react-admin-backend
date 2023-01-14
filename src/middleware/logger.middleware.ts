import { Context, Next } from "koa";
import chalk from "chalk";
import { time } from "../utils/handleTime";

export const logger = async (ctx: Context, next: Next) => {
  const currentTime = time();
  const { method, url } = ctx;
  let data: any = null;
  switch (ctx.method) {
    case "GET":
      data =
        Object.keys(ctx.query).length === 0
          ? ctx.url.slice(ctx.url.lastIndexOf("/") + 1)
          : ctx.query;
      break;
    case "POST":
      data =
        Object.keys(ctx.request.body).length === 0
          ? ctx.query
          : ctx.request.body;
      break;
    case "DELETE":
      const lastIndex = ctx.url.lastIndexOf("/");
      data = ctx.url.slice(lastIndex + 1);
      break;
  }
  await next();

  console.log(
    "\n" +
      chalk.blue(currentTime) +
      " | " +
      chalk.blue(method) +
      " | " +
      chalk.blue(url) +
      " | " +
      chalk.green(JSON.stringify(data)) +
      " | " +
      "\n" +
      chalk.red(JSON.stringify(ctx.body)) +
      "\n"
  );
};
