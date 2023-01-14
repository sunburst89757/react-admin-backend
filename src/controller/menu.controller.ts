import { Menu } from "@prisma/client";
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
  //  查询所有菜单 ---菜单管理使用
  async getMenuList(ctx: Context) {
    const {  id, page, pageSize, name } = ctx.query;

    const data = await service.readMenuList(
      Number(id),
      Number(page) as any,
      Number(pageSize) as any,
      name as string
    );
    ctx.onSuccess({
      data,
    });
  }
  async updateMenu(ctx: Context) {
    const data = await service.updateMenu(ctx.request.body as Menu);
    ctx.onSuccess({
      data,
    });
  }
  async deleteMenu(ctx: Context) {
    const { id } = ctx.params;
    await service.deleteMenu(Number(id));
    ctx.onSuccess({
      data: true,
      message: "删除成功",
    });
  }
}

export const { create, getMenuList, updateMenu, deleteMenu } =
  new MenuController();
