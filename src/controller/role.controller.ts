import { Context } from "koa";
import service from "../service/role.service";
class RoleController {
  async create(ctx: Context) {
    const { roleName, isValid, description } = ctx.request.body;
    const res = await service.addRole({
      roleName,
      isValid,
      description,
    });
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
    const { roleName, description, page, pageSize } = ctx.query;
    const data = await service.getRoleList({
      roleName: roleName as string,
      description: description as string,
      page: Number(page),
      pageSize: Number(pageSize),
    });
    ctx.onSuccess({
      data,
    });
  }
  async updateMenuList(ctx: Context) {
    const { menuIds, roleId } = ctx.request.body;
    const data = await service.updateMenuList(
      roleId as number,
      menuIds as number[]
    );
    ctx.onSuccess({
      data,
    });
  }
  async updateRoleInfo(ctx: Context) {
    const { roleName, description, isValid, id } = ctx.request.body;
    const data = await service.updateRoleInfo({
      id,
      isValid,
      description,
      roleName,
    });
    ctx.onSuccess({
      data,
    });
  }
  async deleteRole(ctx: Context) {
    const { id } = ctx.params;
    const data = await service.deleteRole(Number(id));
    ctx.onSuccess({
      data,
    });
  }
}

export const {
  create,
  distributeRole,
  getMenuListByRoleId,
  getRoleList,
  updateMenuList,
  updateRoleInfo,
  deleteRole,
} = new RoleController();
