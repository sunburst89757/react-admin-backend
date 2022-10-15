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
}

export const { create } = new RoleController();
