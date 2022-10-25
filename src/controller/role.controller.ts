import { Context } from "koa";
import service from "../service/role.service";
class RoleController {
  async create(ctx: Context) {
    const { roleName, menu } = ctx.request.body;
    console.log(roleName);
    const res = await service.addRole(roleName, menu);
    ctx.onSuccess({
      data: res,
    });
  }
  async distributeRole(ctx: Context) {
    const { roleId } = ctx.request.body;
    const data = await service.distributeRoleByUserId(ctx.userId, roleId);
    ctx.onSuccess({
      data,
    });
  }
  async getMenuListByRoleId(ctx: Context) {
    const { roleId } = ctx.params;
    const data = await service.queryMenuListByRoleId(Number(roleId));
    ctx.onSuccess({
      data,
    });
  }
  async getRoleList(ctx: Context) {
    const { roleName, page, pageSize } = ctx.query;
    const data = await service.getRoleList({
      roleName: roleName as string,
      page: Number(page),
      pageSize: Number(pageSize),
    });
    ctx.onSuccess({
      data,
    });
  }
}

export const { create, distributeRole, getMenuListByRoleId, getRoleList } =
  new RoleController();
