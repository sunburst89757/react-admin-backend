import { Context } from "koa";
import service from "../service/button.service";
class ButtonController {
  async getButtonList(ctx: Context) {
    const { roleId } = ctx.params;
    const data = await service.getButtonList(Number(roleId));
    ctx.onSuccess({
      data,
    });
  }
  async addButton(ctx: Context) {
    const { roleId, pathname } = ctx.request.body;
    console.log(roleId, pathname, "是什么", ctx.request.body);

    const data = await service.addButton({
      roleId,
      pathname,
    });
    ctx.onSuccess({
      data,
    });
  }
}

export const { getButtonList, addButton } = new ButtonController();
