import { Context, Next } from "koa";
import { db } from "../app/dataBase";
import { HttpStatus } from "../types/httpStatus";
import { IUserInfo } from "../types/user.type";
import { md5Password } from "../utils/handlePassword";

class AuthMiddleware {
  async verifyAuth(ctx: Context, next: Next) {
    console.log("verify middleware ~");
    await next();
  }
  async encryptPassword(ctx: Context, next: Next) {
    //  密码加密
    ctx.request.body.password = md5Password(ctx.request.body.password);
    await next();
  }
  async verifyUser(ctx: Context, next: Next) {
    const { username } = ctx.request.body as IUserInfo;
    const res = await db.user.findUnique({
      where: {
        username,
      },
    });
    if (res) {
      // 必须return 这个函数终止了才不会走下面的中间件
      return ctx.onError({
        code: HttpStatus.CONFLICT,
        message: "当前用户名已存在，请更换一个",
      });
    }
    await next();
  }
}

export const { verifyAuth, encryptPassword, verifyUser } = new AuthMiddleware();
