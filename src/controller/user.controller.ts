import { Context, Next } from "koa";
import userService from "../service/user.service";
class UserController {
  async create(ctx: Context, next: Next) {
    const res = await userService.createUser();
    ctx.body = res;
  }
}

export const { create } = new UserController();
