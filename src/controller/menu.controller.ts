import { Context } from "koa";
import service from "../service/menu.service";
import { IPath } from "../service/role.service";
class MenuController {
  async create(ctx: Context) {
    const menu = ctx.request.body;
    const res = await service.addPath(menu as IPath);
    ctx.onSuccess({
      data: res,
    });
  }
}

export const { create } = new MenuController();
