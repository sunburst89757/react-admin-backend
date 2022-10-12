import jwt from "jsonwebtoken";
import { Context, Next } from "koa";
import { PRIVATE_KEY } from "../app/config";
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
  async login(ctx: Context, next: Next) {
    const { userId, username } = ctx.user;
    //  openSSL 生成的私钥颁发token
    const token = jwt.sign({ userId, username }, PRIVATE_KEY, {
      expiresIn: 60 * 60 * 24,
      algorithm: "RS256",
    });
    ctx.onSuccess({
      data: {
        userId,
        username,
        token,
      },
    });
  }
}

export const { create, login } = new UserController();
