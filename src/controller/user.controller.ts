import { Context, Next } from "koa";
class UserController {
  async create(ctx: Context, next: Next) {
    ctx.name = "";
  }
}

export const { create } = new UserController();
