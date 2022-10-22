import { PageInfo } from "./../types/user.type";
import { Context } from "koa";
import service from "../service/menu.service";
import { IMenu } from "../service/role.service";
class MenuController {
  async create(ctx: Context) {
    const menu = ctx.request.body;
    const res = await service.createMenu(menu as IMenu);
    ctx.onSuccess({
      data: res,
    });
  }
  // 登录后查询使用
  // async getMenuListByRoleId(ctx: Context) {
  //   const { roleId, path } = ctx.query;
  //   const data = await service.readMenuList(path as string);
  //   ctx.onSuccess({
  //     data,
  //   });
  // }
  //  查询所有菜单 ---菜单管理使用
  async getMenuList(ctx: Context) {
    const { path, page, pageSize } = ctx.query;
    const data = await service.readMenuList(path as string);
    ctx.onSuccess({
      data,
    });
  }
}

export const { create, getMenuList } = new MenuController();
