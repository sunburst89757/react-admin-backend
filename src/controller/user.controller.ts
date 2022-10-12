import { Context, Next } from "koa";
import userService from "../service/user.service";
import { HttpStatus } from "../types/httpStatus";
import { IUserInfo } from "../types/user.type";
class UserController {
  async create(ctx: Context, next: Next) {
    const { username, password } = ctx.request.body as IUserInfo;
    const res = await userService.createUser(username, password);
    ctx.onSuccess({
      data: res,
      code: HttpStatus.OK,
    });
  }
}

export const { create } = new UserController();
