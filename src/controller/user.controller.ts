import { Context, Next } from "koa";
import userService from "../service/user.service";
class UserController {
  async create(ctx: Context, next: Next) {
    const res = await userService.createUser();
    ctx.onSuccess({
      data: res,
      message: "创建成功",
    });
  }
}

export const { create } = new UserController();
