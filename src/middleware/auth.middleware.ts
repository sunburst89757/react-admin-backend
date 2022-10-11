import { Next } from "koa";
import { Context } from "vm";

class AuthMiddleware {
  async verifyAuth(ctx: Context, next: Next) {
    console.log("verify middleware ~");
    await next();
  }
}

export const { verifyAuth } = new AuthMiddleware();
