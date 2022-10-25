import jwt from "jsonwebtoken";
import { Context, Next } from "koa";
import { PRIVATE_KEY } from "../app/config";
import { db } from "../app/dataBase";
import userService from "../service/user.service";
import { HttpStatus } from "../types/httpStatus";
import { IUserInfo } from "../types/user.type";
class UserController {
  async create(ctx: Context, next: Next) {
    console.log(ctx.request.body);
    const res = await userService.createUser(ctx.request.body as any);
    ctx.onSuccess({
      data: res,
      code: HttpStatus.OK,
    });
  }
  async login(ctx: Context, next: Next) {
    const { userId, username, roleId } = ctx.user;
    //  openSSL 生成的私钥颁发token
    const token = jwt.sign({ userId, username }, PRIVATE_KEY, {
      expiresIn: 60 * 60 * 24,
      algorithm: "RS256",
    });
    ctx.onSuccess({
      data: {
        userId,
        roleId,
        username,
        token,
      },
    });
  }
  async logout(ctx: Context) {
    ctx.onSuccess({
      data: null,
    });
  }
  async updateUser(ctx: Context) {
    console.log(ctx.request.body);

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
    console.log(ctx.query);
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
}

export const { create, login, logout, updateUser, deleteUser, getUserList } =
  new UserController();
