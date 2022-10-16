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
}

export const { create, distributeRole } = new RoleController();
