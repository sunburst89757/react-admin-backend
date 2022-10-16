import jwt from "jsonwebtoken";
import { Context, Next } from "koa";
import { PUBLIC_KEY } from "../app/config";
import { db } from "../app/dataBase";
import { HttpStatus } from "../types/httpStatus";
import { IUserInfo } from "../types/user.type";
import { md5Password } from "../utils/handlePassword";

class AuthMiddleware {
  async verifyAuth(ctx: Context, next: Next) {
    console.log("verify middleware ~");
    const { authorization } = ctx.headers;
    // postman 会加上token前缀
    const token = authorization!.replace("Bearer ", "");
    try {
      // 公钥解密
      const res = jwt.verify(token, PUBLIC_KEY, {
        algorithms: ["RS256"],
      });
      ctx.userId = Number((res as { userId: string }).userId);
    } catch (error) {
      console.log(error);
      return ctx.onError({
        code: HttpStatus.UNAUTHORIZED,
        message: "token失效,请重新登录",
      });
    }
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
  async verifyLogin(ctx: Context, next: Next) {
    const { username, password } = ctx.query;
    const res = await db.user.findUnique({
      where: {
        username: username as string,
      },
    });
    if (res?.password !== md5Password(password as string)) {
      return ctx.onError({
        code: HttpStatus.BAD_REQUEST,
        message: "用户名或者密码错误",
      });
    } else {
      // 验证成功

      ctx.user = { username: res.username, userId: res.id, roleId: res.roleId };
    }
    await next();
  }
}

export const { verifyAuth, encryptPassword, verifyUser, verifyLogin } =
  new AuthMiddleware();
