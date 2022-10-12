import { Context, Next } from "koa";
import userService from "../service/user.service";
import { HttpStatus } from "../types/httpStatus";
class UserController {
  async create(ctx: Context, next: Next) {
    const res = await userService.createUser();
    // ctx.onError({
    //   code: HttpStatus.FORBIDDEN,
    // });
    ctx.onSuccess({
      data: res,
      code: HttpStatus.OK,
    });
  }
}

export const { create } = new UserController();
