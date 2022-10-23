import { Context, Next } from "koa";
class GeneralMiddleWare {
  async formatQuery(ctx: Context, next: Next) {
    const copy = JSON.parse(JSON.stringify(ctx.query));
    Object.keys(copy).forEach((key) => {
      ctx.query[key] =
        typeof copy[key] === "string" ? JSON.parse(copy[key]) : copy[key];
    });
    await next();
  }
}

export const { formatQuery } = new GeneralMiddleWare();
