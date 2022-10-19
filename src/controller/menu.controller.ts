import { Context } from "koa";
import service from "../service/menu.service";
import { IMenu } from "../service/role.service";
class MenuController {
  async create(ctx: Context) {
    const menu = ctx.request.body;
    const res = await service.addMenu(menu as IMenu);
    ctx.onSuccess({
      data: res,
    });
  }
  async queryMenuList(ctx: Context) {
    const { roleId } = ctx.query;
    const data = await service.queryMenuListByRoleId(Number(roleId));
    ctx.onSuccess({
      data,
    });
  }
}

export const { create, queryMenuList } = new MenuController();
