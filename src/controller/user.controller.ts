import { Context, Next } from "koa";
import { nanoid } from "nanoid";
import { PRIVATE_KEY, PUBLIC_KEY } from "../app/config";
import userService from "../service/user.service";
import { HttpStatus } from "../types/httpStatus";
import { jwtr } from "../utils/jwt";
class UserController {
  async create(ctx: Context, next: Next) {
    const res = await userService.createUser(ctx.request.body as any);
    ctx.onSuccess({
      data: res,
      code: HttpStatus.OK,
    });
  }
  async login(ctx: Context, next: Next) {
    const { userId, username, roleId } = ctx.user;

    const access_token = await jwtr.sign(
      { jti: String(userId), userId, username, random: nanoid() },
      PRIVATE_KEY,
      {
        expiresIn: 60 * 60 * 24,
        algorithm: "RS256",
      }
    );
    const refresh_token = await jwtr.sign(
      { jti: userId + username, userId, username, random: nanoid() },
      PRIVATE_KEY,
      {
        expiresIn: 7 * 60 * 60 * 24,
        algorithm: "RS256",
      }
    );
    //  openSSL 生成的私钥颁发token
    ctx.onSuccess({
      data: {
        userId,
        roleId,
        username,
        access_token,
        refresh_token,
      },
    });
  }
  async logout(ctx: Context) {
    const userId = ctx.userId;
    const username = ctx.username;
    // 销毁access_token
    await jwtr.destroy(String(userId));
    // 销毁refresh_token
    await jwtr.destroy(userId + username);
    ctx.onSuccess({
      data: null,
    });
  }
  async updateUser(ctx: Context) {

    const data = await userService.updateUser(ctx.request.body as any);

    ctx.onSuccess({
      data,
    });
  }
  async deleteUser(ctx: Context) {
    const { id } = ctx.params;
    const data = await userService.deleteUser(Number(id));
    ctx.onSuccess({
      data,
    });
  }
  async getUserList(ctx: Context) {
    const { username, page, pageSize } = ctx.query;
    const data = await userService.getUserList({
      username,
      page: Number(page),
      pageSize: Number(pageSize),
    } as any);
    ctx.onSuccess({
      data,
    });
  }
  async refreshToken(ctx: Context) {
    const { refresh_token } = ctx.request.body;
    const { userId, username }: { username: string; userId: number } =
      await jwtr.verify(refresh_token, PUBLIC_KEY, {
        algorithms: ["RS256"],
      });
    const access_token = await jwtr.sign(
      { jti: String(userId), userId, username, random: nanoid() },
      PRIVATE_KEY,
      {
        expiresIn: 60 * 60 * 24,
        algorithm: "RS256",
      }
    );
    //  openSSL 生成的私钥颁发token
    ctx.onSuccess({
      data: {
        access_token,
      },
    });
  }
}

export const {
  create,
  login,
  logout,
  updateUser,
  deleteUser,
  getUserList,
  refreshToken,
} = new UserController();
